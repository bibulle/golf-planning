import { GoogleEvent, GoogleInfos } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { readFile, writeFile } from 'fs';
import { calendar_v3, google } from 'googleapis';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class CalendarService {
  private static readonly logger = new Logger(CalendarService.name);

  toto: calendar_v3.Schema$Event;
  private static users: { [user_name: string]: GoogleInfos } = {};
  private readonly TOKENS_PATH = 'tokens.json';

  constructor(private readonly _configService: ConfigService, private readonly _courseService: CoursesService) {
    readFile(this.TOKENS_PATH, (err, tokens) => {
      if (err) return;
      CalendarService.users = JSON.parse(tokens.toString());

      this.handleCronCalendar();
    });
  }

  addUserGoogleInfos(userName: string, tokens: GoogleInfos | void) {
    if (!tokens) {
      return this.removeUserGoogleInfos(userName);
    }
    CalendarService.users[userName] = tokens;

    writeFile(this.TOKENS_PATH, JSON.stringify(CalendarService.users), (err) => {
      if (err) {
        CalendarService.logger.error('Tokens cannot be stored to', this.TOKENS_PATH);
        CalendarService.logger.error(err);
      }
    });
  }
  removeUserGoogleInfos(userName: string) {
    delete CalendarService.users[userName];

    writeFile(this.TOKENS_PATH, JSON.stringify(CalendarService.users), (err) => {
      if (err) {
        CalendarService.logger.error('Tokens cannot be stored to', this.TOKENS_PATH);
        CalendarService.logger.error(err);
      }
    });
  }

  private async _getTokenWithRefresh(googleInfos: GoogleInfos): Promise<GoogleInfos> {
    return new Promise<GoogleInfos>((resolve, reject) => {
      const oauth2Client = new google.auth.OAuth2(
        this._configService.get('AUTHENT_GOOGLE_CLIENT_ID'),
        this._configService.get('AUTHENT_GOOGLE_CLIENT_SECRET'),
        this._configService.get('AUTHENT_GOOGLE_CALLBACK_URL')
      );

      oauth2Client.credentials.refresh_token = googleInfos.refreshToken;

      oauth2Client.refreshAccessToken((error, newTokens) => {
        if (error) {
          CalendarService.logger.error('Cannot refresh token', error);
          return reject(error);
        } else {
          resolve({
            ...googleInfos,
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token,
          });
        }
      });
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  //@Cron(CronExpression.EVERY_10_MINUTES)
  handleCronCalendar() {
    CalendarService.logger.debug('handleCronCalendar');

    Object.entries(CalendarService.users).forEach(async ([userName, googleInfos]) => {
      // read googles events
      this.getGoogleEvents(userName, googleInfos)
        .catch((err) => {
          CalendarService.logger.error(err);
        })
        .then((calendar) => {
          CalendarService.logger.debug(`${calendar ? calendar.length : 0} events found in google for ${userName}`);

          // limit to right title : "Cours : .... (...)"
          const googleCalendar: GoogleEvent[] = !calendar
            ? []
            : calendar.filter((e) => {
                return e.summary.match(/^Cours .*: .* (.*)$/) != null;
              });

          // get the courses for the user
          const golfCalendar = this.getGolfCoursesAsGoogleEvent(userName);
          if (golfCalendar.length === 0) {
            CalendarService.logger.warn(`No golf events founds for ${userName} !! Do not try to manage google.`);
            return;
          }

          // Add to google golf course that are not already in google
          golfCalendar
            .filter((golfEvent) => {
              return !googleCalendar.some((googleEvent) => {
                // if (JSON.stringify(golfEvent).substring(0,50) === JSON.stringify(googleEvent).substring(0,50)) {
                //   CalendarService.logger.debug(JSON.stringify(golfEvent));
                //   CalendarService.logger.debug(JSON.stringify(googleEvent));
                //   CalendarService.logger.debug(JSON.stringify(golfEvent).substring(0,50));
                // }
                const googleEventWithoutId = { ...googleEvent };
                delete googleEventWithoutId.id;

                return JSON.stringify(golfEvent) === JSON.stringify(googleEventWithoutId);
              });
            })
            .forEach((e) => {
              this.addGoogleEvent(e, googleInfos);
            });

          // remove google calendar that are not in golf
          googleCalendar
            .filter((googleEvent) => {
              const googleEventWithoutId = { ...googleEvent };
              delete googleEventWithoutId.id;

              return !golfCalendar.some((golfEvent) => {
                return JSON.stringify(golfEvent) === JSON.stringify(googleEventWithoutId);
              });
            })
            .forEach((e) => {
              this.removeGoogleEvent(e, googleInfos);
            });
        });
    });
  }

  /**
   * Get golf courses from user as Google events
   * @param userName
   * @returns
   */
  getGolfCoursesAsGoogleEvent(userName): GoogleEvent[] {
    return this._courseService.getCourse(userName).map((c) => {
      const times = c.hour.split(':').map((s) => +s);

      const startDate = new Date(c.date);
      startDate.setHours(times[0]);
      startDate.setMinutes(times[1]);

      const endDate = new Date(c.date);
      endDate.setHours(times[0] + 1);
      endDate.setMinutes(times[1]);

      return {
        summary: `Cours golf : ${c.title} (${c.prof})`,
        location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
        start: {
          dateTime: startDate.toISOString().substring(0, 11) + startDate.toLocaleTimeString() + '+01:00',
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: endDate.toISOString().substring(0, 11) + endDate.toLocaleTimeString() + '+01:00',
          timeZone: 'Europe/Paris',
        },
      };
    });
  }
  /**
   * Get events from google calendar
   * @param userName
   * @param googleInfos
   * @returns
   */
  async getGoogleEvents(userName: string, googleInfos: GoogleInfos): Promise<void | GoogleEvent[]> {
    return new Promise<void | GoogleEvent[]>((resolve, reject) => {
      CalendarService.logger.debug(`getGoogleEvents(${userName})`);

      const calendar = google.calendar({
        version: 'v3',
        headers: {
          Authorization: `Bearer ${googleInfos.accessToken}`,
        },
      });

      // Get the right calendar ('golf')
      calendar.calendarList
        .list()
        .catch((err) => {
          if (err.code === 401) {
            this._getTokenWithRefresh(googleInfos)
              .catch((err) => {
                CalendarService.logger.error(`Removing tokens due to error ${err}`);
                this.removeUserGoogleInfos(userName);
                reject(err);
              })
              .then((newTokens) => {
                this.addUserGoogleInfos(userName, newTokens);
                if (newTokens) {
                  this.getGoogleEvents(userName, newTokens)
                    .catch((err) => reject(err))
                    .then((res) => resolve(res));
                }
              });
          } else {
            CalendarService.logger.error('Getting calendar list error: ' + err);
            reject(err);
          }
        })
        .then((list) => {
          let goldCalendarId = '';
          if (list && list.data && list.data.items) {
            list.data.items.forEach((element) => {
              // CalendarService.logger.log(`${element.summary} (${element.id})`);
              if (element.summary.toLowerCase() === 'golf') {
                goldCalendarId = element.id;
              }
            });
          }
          if (goldCalendarId === '') {
            CalendarService.logger.debug(`${userName} has no 'golf' calendar, force it to 'primary'`);
            goldCalendarId = 'primary';
            //reject(`${userName} has no 'golf' calendar`);
          }

          // save the calendar Id
          googleInfos.golfCalendarId = goldCalendarId;
          this.addUserGoogleInfos(userName, googleInfos);

          // get the calendars events
          const cals: GoogleEvent[] = [];

          calendar.events
            .list({
              calendarId: goldCalendarId,
              timeMin: new Date('2021/11/11').toISOString(),
              maxResults: 1000,
              singleEvents: true,
              orderBy: 'startTime',
            })
            .catch((err) => {
              CalendarService.logger.error('The API returned an error: ' + err);
              reject(err);
            })
            .then((res) => {
              if (res && res.data && res.data.items) {
                const events = res.data.items;
                if (events.length) {
                  events.forEach((event) => {
                    //const start = event.start.dateTime || event.start.date;
                    //const end = event.end.dateTime || event.end.date;

                    // clean the event
                    Object.keys(event)
                      .filter((k) => {
                        return ['summary', 'start', 'end', 'location', 'id'].indexOf(k) === -1;
                      })
                      .forEach((k) => {
                        delete event[k];
                        // CalendarService.logger.debug(k);
                      });

                    cals.push(event);
                  });
                } else {
                  CalendarService.logger.log('No upcoming events found.');
                }
              }
              resolve(cals);
            });
        });
    });
  }

  /**
   * Add a google event to the golf calendar
   * @param event
   */
  async addGoogleEvent(event: GoogleEvent, googleInfos: GoogleInfos) {
    const calendar = google.calendar({
      version: 'v3',
      headers: {
        Authorization: `Bearer ${googleInfos.accessToken}`,
      },
    });

    await calendar.events.insert({
      calendarId: googleInfos.golfCalendarId,
      requestBody: event,
    }).catch(err => {
      CalendarService.logger.error(`Error adding to google : ${event.summary} ${event.start.dateTime} ${err}`);
    }).then(() => {
      CalendarService.logger.log(`Added to google : ${event.summary} ${event.start.dateTime}`);
    });;
  }
  /**
   * Remove a google event from the golf calendar
   * @param event
   */
  async removeGoogleEvent(event: GoogleEvent, googleInfos: GoogleInfos) {
    // CalendarService.logger.debug('Removed from google' + JSON.stringify(event));

    const calendar = google.calendar({
      version: 'v3',
      headers: {
        Authorization: `Bearer ${googleInfos.accessToken}`,
      },
    });

    await calendar.events.delete({
      calendarId: googleInfos.golfCalendarId,
      eventId: event.id,
    }).catch(err => {
      CalendarService.logger.error(`Error removing from google : ${event.summary} ${event.start.dateTime} ${err}`);
    }).then(() => {
      CalendarService.logger.log(`Removed from google : ${event.summary} ${event.start.dateTime}`);
    });
  }
}
