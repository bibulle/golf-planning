import { CALENDAR_MOCK, GoogleEvent, GoogleInfos, ServiceStatus } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
// import { readFile, writeFile } from 'fs';
import { google } from 'googleapis';
import { CoursesService } from '../courses/courses.service';
import { EventsService } from '../events/events.service';
import { CronJob } from 'cron';
import { ParcoursService } from '../parcours/parcours.service';
import { DbService } from '../utils/db.service';

@Injectable()
export class CalendarService {
  private static readonly logger = new Logger(CalendarService.name);

  private static readonly CRON_GOOGLE_FORCE_DEFAULT = CronExpression.EVERY_DAY_AT_5AM;
  private static readonly CRON_GOOGLE_RECURRING_DEFAULT = '15 */10 * * * *';
  private static cronGoogleForce = CalendarService.CRON_GOOGLE_FORCE_DEFAULT;
  private static cronGoogleRecurrent = CalendarService.CRON_GOOGLE_RECURRING_DEFAULT;

  private static users: { [user_name: string]: GoogleInfos } = {};
  // private readonly TOKENS_PATH = 'tokens.json';

  usersStatus: { [user_name: string]: ServiceStatus } = {};

  constructor(
    private readonly _configService: ConfigService,
    private readonly _courseService: CoursesService,
    private readonly _parcoursService: ParcoursService,
    private _eventService: EventsService,
    private _schedulerRegistry: SchedulerRegistry,
    private _dbService: DbService
  ) {
    CalendarService.cronGoogleForce = this._configService.get('CRON_GOOGLE_FORCE', CalendarService.CRON_GOOGLE_FORCE_DEFAULT);
    CalendarService.cronGoogleRecurrent = this._configService.get('CRON_GOOGLE_RECURRING', CalendarService.CRON_GOOGLE_RECURRING_DEFAULT);
    CalendarService.logger.debug(`cronGoogleRecurrent : ${CalendarService.cronGoogleRecurrent}`);
    CalendarService.logger.debug(`cronGoogleForce     : ${CalendarService.cronGoogleForce}`);

    const job1 = new CronJob(CalendarService.cronGoogleRecurrent, () => {
      this.handle10MinutesCron();
    });
    this._schedulerRegistry.addCronJob('cronGoogleRecurrent', job1);
    job1.start();
    const job2 = new CronJob(CalendarService.cronGoogleForce, () => {
      this.handleDailyCron();
    });
    this._schedulerRegistry.addCronJob('cronGoogleForce', job2);
    job2.start();

    this._dbService
      .getGoogleTokens()
      .then((tokens) => {
        CalendarService.users = tokens;
        setTimeout(this.loadAllGoogleCourses.bind(this), 15 * 1000);
      })
      .catch((reason) => {
        CalendarService.logger.error(reason);
      });
  }

  addUserGoogleInfos(userName: string, tokens: GoogleInfos | void) {
    if (!tokens) {
      return this.removeUserGoogleInfos(userName);
    }
    CalendarService.users[userName] = tokens;

    this._dbService.setGoogleTokens(CalendarService.users).catch((reason) => {
      CalendarService.logger.error('Tokens cannot be stored ');
      CalendarService.logger.error(reason);
    });
  }
  removeUserGoogleInfos(userName: string) {
    delete CalendarService.users[userName];

    this._dbService.setGoogleTokens(CalendarService.users).catch((reason) => {
      CalendarService.logger.error('Tokens cannot be stored ');
      CalendarService.logger.error(reason);
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

  // @Cron(CalendarService.cronGoogleForce)
  handleDailyCron() {
    this.loadAllGoogleCourses();
  }

  // @Cron(CalendarService.cronGoogleRecurrent)
  handle10MinutesCron() {
    // If there is someone connected, update
    if (this._eventService.geConnectedClientCount() > 0) {
      this.loadAllGoogleCourses();
    }
  }

  loadAllGoogleCourses() {
    CalendarService.logger.log('loadAllGoogleCourses');

    Object.entries(CalendarService.users).forEach(async ([userName, googleInfos]) => {
      if (!this.usersStatus[userName]) {
        this.usersStatus[userName] = new ServiceStatus();
      }
      // read googles events
      this.getGoogleEvents(userName, googleInfos)
        .then(async (calendar) => {
          CalendarService.logger.debug(`${calendar ? calendar.length : 0} events found in google for ${userName}`);

          // limit to right title : "Cours : .... (...)"
          const googleCalendar: GoogleEvent[] = !calendar
            ? []
            : calendar.filter((e) => {
                // CalendarService.logger.debug(e);
                return e.summary && e.summary.match(/^(Cours|Parcours) golf.*: .* (.*)$/) != null;
              });

          this.usersStatus[userName].ok = true;
          this.usersStatus[userName].lastLoad = new Date();
          this.usersStatus[userName].count = googleCalendar.length;

          // get the courses for the user
          const golfCalendar = this.getGolfCoursesAsGoogleEvent(userName);
          if (golfCalendar.length === 0) {
            CalendarService.logger.warn(`No golf events founds for ${userName} !! Do not try to manage google.`);
            return;
          }

          // count events
          const parcoursCount = golfCalendar.filter((c) => {
            return c.summary.startsWith('Parcours');
          }).length;
          const coursCount = golfCalendar.filter((c) => {
            // CalendarService.logger.debug(c);
            return c.summary.startsWith('Cours');
          }).length;
          CalendarService.logger.warn(`golfCalendar   : ${parcoursCount} parcours & ${coursCount} cours`);
          // CalendarService.logger.warn(`golfCalendar   : ${JSON.stringify(golfCalendar, null, 2)} `);
          // CalendarService.logger.warn(`googleCalendar : ${googleCalendar.length} `);

          if (coursCount === 0) {
            CalendarService.logger.warn('Cours not yet loaded, do nothing');
          } else {
            // Add to google golf course that are not already in google
            const l1 = golfCalendar.filter((golfEvent) => {
              return !googleCalendar.some((googleEvent) => {
                const googleEventWithoutId = { ...googleEvent };
                delete googleEventWithoutId.id;
                // if (JSON.stringify(golfEvent).match(/2022-04-18/) && JSON.stringify(googleEventWithoutId).match(/2022-04-18/)) {
                //   CalendarService.logger.debug(`Added   : ${JSON.stringify(golfEvent)}`);
                //   CalendarService.logger.debug(`        : ${JSON.stringify(googleEventWithoutId)}`);
                // }

                return JSON.stringify(golfEvent) === JSON.stringify(googleEventWithoutId);
              });
            });
            for (const e of l1) {
              this.addGoogleEvent(userName, e, googleInfos);
              await this.delay(2000);
            }

            // Found duplicate in google calendar
            const l2 = googleCalendar.filter((googleEvent) => {
              const googleEventWithoutId = { ...googleEvent };
              delete googleEventWithoutId.id;
              return googleCalendar.some((googleEvent2) => {
                const googleEventWithoutId2 = { ...googleEvent2 };
                delete googleEventWithoutId2.id;

                // if (JSON.stringify(googleEventWithoutId2) === JSON.stringify(googleEventWithoutId)) {
                //   CalendarService.logger.debug(`Duplicate : ${googleEvent.summary} ${googleEvent.start.dateTime} ${googleEvent.id}`);
                //   CalendarService.logger.debug(`          : ${googleEvent2.summary} ${googleEvent2.start.dateTime} ${googleEvent2.id}`);
                //   CalendarService.logger.debug(`          : ${JSON.stringify(googleEventWithoutId2) === JSON.stringify(googleEventWithoutId)} ${googleEvent.id > googleEvent2.id}`);
                // }

                return JSON.stringify(googleEventWithoutId2) === JSON.stringify(googleEventWithoutId) && googleEvent.id > googleEvent2.id;
              });
            });
            for (const e of l2) {
              CalendarService.logger.debug(`Duplicate : ${e.summary} ${e.start.dateTime} ${e.id}`);
              this.removeGoogleEvent(userName, e, googleInfos);
              await this.delay(2000);
            }

            // remove google calendar that are not in golf
            const l3 = googleCalendar.filter((googleEvent) => {
              const googleEventWithoutId = { ...googleEvent };
              delete googleEventWithoutId.id;
              return !golfCalendar.some((golfEvent) => {
                // if (JSON.stringify(golfEvent).match(/2022-04-18/) && JSON.stringify(googleEventWithoutId).match(/2022-04-18/)) {
                //   CalendarService.logger.debug(`Removed : ${JSON.stringify(golfEvent)}`);
                //   CalendarService.logger.debug(`        : ${JSON.stringify(googleEventWithoutId)}`);
                // }
                return JSON.stringify(golfEvent) === JSON.stringify(googleEventWithoutId);
              });
            });
            for (const e of l3) {
              this.removeGoogleEvent(userName, e, googleInfos);
              await this.delay(2000);
            }
          }
        })
        .catch((err) => {
          CalendarService.logger.error(err);
          this.usersStatus[userName].ok = false;
          this.usersStatus[userName].error = '' + err;
          // if (err?.data?.error?.message) {
          //   this.usersStatus[userName].error = err?.data?.error?.message;
          // }
        });
    });
  }

  /**
   * Get golf courses from user as Google events
   * @param userName
   * @returns
   */
  getGolfCoursesAsGoogleEvent(userName): GoogleEvent[] {
    return this._courseService
      .getCourse(userName)
      .map((c) => {
        // CalendarService.logger.debug(`${userName} : ${c.title} `);
        const times = c.hour.split(':').map((s) => +s);

        // CalendarService.logger.debug(c.date.toTimeString().replace(/^[0-9:]* /, "").replace(/ .*$/,""));
        const startDate = new Date(c.date);
        startDate.setHours(times[0]);
        startDate.setMinutes(times[1]);

        const endDate = new Date(c.date);
        endDate.setHours(times[0] + 1);
        endDate.setMinutes(times[1]);

        const timezone = c.date
          .toTimeString()
          .replace(/^[0-9:]* /, '')
          .replace(/ .*$/, '')
          .replace(/^(.*)([0-9][0-9])$/, '$1:$2');

        //CalendarService.logger.debug(`${timezone} ${c.date.toISOString()}`)

        return {
          summary: `Cours golf : ${c.title} (${c.prof})`,
          location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
          start: {
            dateTime: this.formatDateToGoogleDate(startDate, timezone),
            timeZone: timezone,
          },
          end: {
            dateTime: this.formatDateToGoogleDate(endDate, timezone),
            timeZone: timezone,
          },
        };
      })
      .concat(
        this._parcoursService.getParcours().map((p) => {
          const timezone = p.teetime
            .toTimeString()
            .replace(/^[0-9:]* /, '')
            .replace(/ .*$/, '')
            .replace(/^(.*)([0-9][0-9])$/, '$1:$2');

          const endDate = new Date(p.teetime);
          endDate.setMinutes(p.teetime.getMinutes() + 10 * p.holes);

          // CalendarService.logger.debug(`${timezone} ${p.teetime.toISOString()}`)

          return {
            summary: `Parcours golf : ${p.course.name} (${p.club.name})`,
            location: `${p.club.name}`,
            start: {
              dateTime: this.formatDateToGoogleDate(p.teetime, timezone),
              timeZone: timezone,
            },
            end: {
              dateTime: this.formatDateToGoogleDate(endDate, timezone),
              timeZone: timezone,
            },
          };
        })
      );
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

      if (this._configService.get(`USE_GOOGLE_MOCK`) && /true/i.test(this._configService.get(`USE_GOOGLE_MOCK`))) {
        CalendarService.logger.warn('Using google mock !!!');
        if (userName === 'Bibulle Martin') {
          const cals: GoogleEvent[] = CALENDAR_MOCK;
          return resolve(cals);
        } else {
          this.removeUserGoogleInfos(userName);
          return reject(`User '${userName}' not in mocks`);
        }
      }

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
                CalendarService.logger.error(`${userName} : Removing tokens due to error ${err}`);
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
            CalendarService.logger.error(`${userName} : Getting calendar list error: ${err}`);
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
                    //CalendarService.logger.debug(event);
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
  async addGoogleEvent(userName: string, event: GoogleEvent, googleInfos: GoogleInfos) {
    CalendarService.logger.debug(`Adding to google : ${new Date(event.start.dateTime).toLocaleString()} - ${userName} (${event.summary})`);

    if (this._configService.get(`USE_GOOGLE_MOCK`) && /true/i.test(this._configService.get(`USE_GOOGLE_MOCK`))) {
      CalendarService.logger.warn('Using google mock !!!');
      return;
    }

    const calendar = google.calendar({
      version: 'v3',
      headers: {
        Authorization: `Bearer ${googleInfos.accessToken}`,
      },
    });

    await calendar.events
      .insert({
        calendarId: googleInfos.golfCalendarId,
        requestBody: event,
      })
      .catch((err) => {
        CalendarService.logger.error(`Error adding to google : ${event.summary} ${event.start.dateTime} ${err}`);
      })
      .then(() => {
        CalendarService.logger.log(`Added to google : ${event.summary} ${event.start.dateTime}`);
        this._eventService.sendMessage(`Added to ${userName}'s google : ${event.summary} (${new Date(event.start.dateTime).toLocaleDateString()})`);
      });
  }
  /**
   * Remove a google event from the golf calendar
   * @param event
   */
  async removeGoogleEvent(userName: string, event: GoogleEvent, googleInfos: GoogleInfos) {
    CalendarService.logger.debug(`Removed from google : ${event.summary} ${event.start.dateTime}`);

    if (this._configService.get(`USE_GOOGLE_MOCK`) && /true/i.test(this._configService.get(`USE_GOOGLE_MOCK`))) {
      CalendarService.logger.warn('Using google mock !!!');
      return;
    }

    const calendar = google.calendar({
      version: 'v3',
      headers: {
        Authorization: `Bearer ${googleInfos.accessToken}`,
      },
    });

    await calendar.events
      .delete({
        calendarId: googleInfos.golfCalendarId,
        eventId: event.id,
      })
      .catch((err) => {
        CalendarService.logger.error(`Error removing from google : ${event.summary} ${event.start.dateTime} ${err}`);
      })
      .then(() => {
        CalendarService.logger.log(`Removed from google : ${event.summary} ${event.start.dateTime}`);
        this._eventService.sendMessage(`Removed from ${userName}'s google : ${event.summary} (${new Date(event.start.dateTime).toLocaleDateString()})`);
      });
  }

  formatDateToGoogleDate(date: Date, timezone: string): string {
    const tz = timezone.replace(/^.*([+-][0-9][0-9])[:]*([0-9][0-9])$/, '$1:$2');

    let res = '';
    res += `${date.getFullYear()}-${(1 + date.getMonth()).toPrecision().padStart(2, '0')}-${date.getDate().toPrecision().padStart(2, '0')}`;
    res += `T${date.getHours().toPrecision().padStart(2, '0')}:${date.getMinutes().toPrecision().padStart(2, '0')}:${date.getSeconds().toPrecision().padStart(2, '0')}${tz}`;
    return res;
  }

  private delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  getUsersStatus(): Promise<{ [user_name: string]: ServiceStatus }> {
    return Promise.resolve(this.usersStatus);
  }
}
