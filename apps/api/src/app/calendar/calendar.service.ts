import { CalendarEvent, GoogleToken } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { readFile, writeFile } from 'fs';
import { google } from 'googleapis';

@Injectable()
export class CalendarService {
  private static readonly logger = new Logger(CalendarService.name);

  private static users: { [user_name: string]: GoogleToken } = {};
  private readonly TOKENS_PATH = 'tokens.json';

  private userEvents: { [user_name: string]: CalendarEvent[] } = {};

  constructor(private readonly _configService: ConfigService) {
    readFile(this.TOKENS_PATH, (err, tokens) => {
      if (err) return;
      CalendarService.users = JSON.parse(tokens.toString());

      this.handleCronCalendar();
    });
  }

  addUserTokens(userName: string, tokens: GoogleToken | void) {
    if (!tokens) {
      return this.removeUserTokens(userName);
    }
    CalendarService.users[userName] = tokens;

    writeFile(this.TOKENS_PATH, JSON.stringify(CalendarService.users), (err) => {
      if (err) {
        CalendarService.logger.error('Tokens cannot be stored to', this.TOKENS_PATH);
        CalendarService.logger.error(err);
      }
    });
  }
  removeUserTokens(userName: string) {
    delete CalendarService.users[userName];

    writeFile(this.TOKENS_PATH, JSON.stringify(CalendarService.users), (err) => {
      if (err) {
        CalendarService.logger.error('Tokens cannot be stored to', this.TOKENS_PATH);
        CalendarService.logger.error(err);
      }
    });
  }

  private async _getTokenWithRefresh(refreshToken: string): Promise<GoogleToken> {
    return new Promise<GoogleToken>((resolve, reject) => {
      const oauth2Client = new google.auth.OAuth2(
        this._configService.get('AUTHENT_GOOGLE_CLIENT_ID'),
        this._configService.get('AUTHENT_GOOGLE_CLIENT_SECRET'),
        this._configService.get('AUTHENT_GOOGLE_CALLBACK_URL')
      );

      oauth2Client.credentials.refresh_token = refreshToken;

      oauth2Client.refreshAccessToken((error, tokens) => {
        if (error) {
          CalendarService.logger.error('Cannot refresh token', error);
          return reject(error);
        } else {
          resolve({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          });
        }
      });
    });
  }

  //@Cron(CronExpression.EVERY_MINUTE)
  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCronCalendar() {
    CalendarService.logger.debug('handleCronCalendar');

    Object.entries(CalendarService.users).forEach(async ([userName, tokens]) => {
      // CalendarService.logger.debug(name);
      // CalendarService.logger.debug(tokens);

      await this.getCalendarEvents(userName, tokens);
      //CalendarService.logger.debug(JSON.stringify(this.userEvents, null, 2));
      CalendarService.logger.debug(`${this.userEvents[userName].length} events foudnd in google for ${userName}`);
    });
  }

  async getCalendarEvents(userName: string, tokens: GoogleToken) {
    CalendarService.logger.debug(`getEvents(${userName})`);

    const calendar = google.calendar({
      version: 'v3',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Get the right calendar ('golf')
    await calendar.calendarList
      .list()
      .catch(async (err) => {
        if (err.code === 401) {
          await this._getTokenWithRefresh(tokens.refreshToken)
            .catch((err) => {
              CalendarService.logger.error(`Removing tokens due to error ${err}`);
              this.removeUserTokens(userName);
            })
            .then((tokens) => {
              this.addUserTokens(userName, tokens);
            });
        } else {
          CalendarService.logger.error('Getting calendar list error: ' + err);
        }
      })
      .then(async (list) => {
        let goldCalendarId = '';
        if (list && list.data && list.data.items) {
          list.data.items.forEach((element) => {
            //CalendarService.logger.log(`${element.summary} (${element.id})`);
            if (element.summary.toLowerCase() === 'golf') {
              goldCalendarId = element.id;
            }
          });
        }
        if (goldCalendarId === '') {
          return CalendarService.logger.warn(`${userName} has no 'golf' calendar`);
        }

        // get the calendars events
        const cals: CalendarEvent[] = [];

        const res = await calendar.events
          .list({
            calendarId: goldCalendarId,
            timeMin: new Date('2021/11/11').toISOString(),
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime',
          })
          .catch((err) => CalendarService.logger.error('The API returned an error: ' + err));

        if (res && res.data && res.data.items) {
          const events = res.data.items;
          if (events.length) {
            events.forEach((event) => {
              const start = event.start.dateTime || event.start.date;
              const end = event.end.dateTime || event.end.date;

              cals.push({
                title: event.summary,
                startDate: new Date(start),
                endDate: new Date(end),
              });
            });
            this.userEvents[userName] = cals;
          } else {
            CalendarService.logger.log('No upcoming events found.');
          }
        }
      });
  }
}
