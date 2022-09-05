import { GlobalStatus, ServiceStatus } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { CalendarService } from '../calendar/calendar.service';
import { CoursesService } from '../courses/courses.service';
import { ParcoursService } from '../parcours/parcours.service';

@Injectable()
export class HealthService {
  readonly logger = new Logger(HealthService.name);

  constructor(private _calendarService: CalendarService, private _courseService: CoursesService, private _parcourtService: ParcoursService) {}

  getHealthSattus(): Promise<GlobalStatus> {
    return new Promise<GlobalStatus>((resolve, reject) => {
      Promise.allSettled([this._courseService.getCoursesStatus(), this._courseService.getUsersStatus(), this._calendarService.getUsersStatus(), this._parcourtService.getUsersStatus()])
        .then((results) => {
          const ret = new GlobalStatus();
          ret.golfStatus = 'OK';
          results.forEach((r, index) => {
            // this.logger.debug(`${index} ${JSON.stringify(r, null, 2)}`);
            if (r.status === 'fulfilled') {
              switch (index) {
                case 0: // Course Status
                  ret.course = r.value as ServiceStatus;
                  break;
                case 1: // Course User Status
                  ret.courseUser = r.value as { [user_name: string]: ServiceStatus };
                  break;
                case 2: // Google User Status
                  ret.googleUser = r.value as { [user_name: string]: ServiceStatus };
                  break; 
                case 3: // parcourt User Status
                ret.parcourtUser = r.value as { [user_name: string]: ServiceStatus };
                  break;
              }
            } else {
              ret.golfStatus = "KO";
              this.logger.error(`${index} ${JSON.stringify(r, null, 2)}`);
            }
          });
          if (!ret.course.ok || !Object.values(ret.courseUser).every((s) => s.ok) || !Object.values(ret.googleUser).every((s) => s.ok) || !Object.values(ret.parcourtUser).every((s) => s.ok)) {
            // this.logger.debug(`ret.course.ok     ${ret.course.ok}`);
            // this.logger.debug(`ret.courseUser.ok ${Object.values(ret.courseUser).every((s) => s.ok)}`);
            ret.golfStatus = 'KO';
          }
          resolve(ret);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
