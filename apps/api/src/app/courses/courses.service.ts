import { Course, COURSE_MOCK, PLANNING_MOCK, User } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { AcademiegolfService } from './academiegolf.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  NB_DAYS_PLANNING = 20;

  planning: Course[] = [];
  courses: Course[] = [];

  constructor(private userService: UsersService, private acadeliegolfService: AcademiegolfService, private eventService: EventsService, private configService: ConfigService) {
    this.handleCronPlanning();
  }

  getPlanning(): Course[] {
     return this.planning;
  }

  @Cron('0 */10 * * * *')
  //@Cron(CronExpression.EVERY_30_SECONDS)
  //@Interval(10000)
  handleCronPlanning() {
    this.logger.debug('Called every 10 minutes');
    const users: User[] = this.userService.readFromEnv();
    this.logger.debug(`Found ${users.length} users`);

    if (this.configService.get(`USE_COURSE_MOCK`) && /true/i.test(this.configService.get(`USE_COURSE_MOCK`))) {
      this.logger.warn('Using course mock !!!');
      this.planning = PLANNING_MOCK;
      this.courses = COURSE_MOCK;
      return;
    }

    (async () => {
      const planningTabs: { [key: string]: Course } = {};
      const coursesTabs: { [key: string]: Course } = {};

      // get planning
      for (let i = 0; i < this.NB_DAYS_PLANNING; i++) {
        const date = new Date();
        date.setHours(12);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() + i);

        //this.logger.debug(i);
        const lessons = await this.getPlanningGlobal(users[0], date).catch((reason) => {
          this.logger.error(reason);
        });
        if (!lessons) {
          break;
        }

        lessons.forEach((c) => {
          planningTabs[c.getKey()] = c;
        });
      }

      // get users course
      await Promise.all(
        users.map(async (u) => {
          const lessons = await this.getPlanningUser(u).catch((reason) => {
            this.logger.error(reason);
          });
          //this.logger.debug(JSON.stringify(lessons,null,2));
          if (lessons) {
            lessons.forEach((l) => {
              // add users to course in planning
              if (planningTabs[l.getKey()]) {
                const nu = new User(u.displayName);
                nu.academiergolf_index = u.academiergolf_index;
                planningTabs[l.getKey()].users.push(nu);
                //this.logger.debug(`${l.getKey()} -> ${u.displayName}`);
                //this.logger.debug(JSON.stringify(planningTabs[l.getKey()], null, 2));
                //this.logger.debug(`${l.getKey()} ${JSON.stringify(planningTabs[l.getKey()])}`)
              }

              if (!coursesTabs[l.getKey()]) {
                coursesTabs[l.getKey()] = l;
              }
              coursesTabs[l.getKey()].users.push(new User(u.displayName));
            });
          }
        })
      );
      const newPlanning: Course[] = Object.values(planningTabs).sort((a, b) => {
        return a.getKey().localeCompare(b.getKey());
      });
      const newCourses: Course[] = Object.values(coursesTabs).sort((a, b) => {
        return a.getKey().localeCompare(b.getKey());
      });

      // test differences
      if (JSON.stringify(newPlanning) !== JSON.stringify(this.planning)) {
        this.planning = newPlanning;
        // this.logger.debug(JSON.stringify(this.planning));
        this.eventService.planningUpdated();
      }
      if (JSON.stringify(newCourses) !== JSON.stringify(this.courses)) {
        this.courses = newCourses;
        // this.logger.debug(JSON.stringify(this.courses));
        this.eventService.courseUpdated();
      }

      // planning.forEach((p) => {
      //   this.logger.debug(`${p.title} : ${p.date.toLocaleDateString()} ${p.hour} (${p.prof})`);
      // });
    })();
  }

  /**
   * Get a planning for a day
   * @param date the searched day (or none if today)
   * @returns
   */
  private async getPlanningGlobal(user: User, date: Date): Promise<Course[]> {
    const dom = await this.acadeliegolfService.getPlanningGlobalPage(user, date);

    if (!dom) {
      return undefined;
    }

    const lessons = this.acadeliegolfService.getFromPage(dom, date);

    return lessons;
  }

  /**
   * Get a planning for a user
   * @returns
   */
  private async getPlanningUser(user: User): Promise<Course[]> {
    const dom = await this.acadeliegolfService.getPlanningUserPage(user);

    if (!dom) {
      return undefined;
    }

    const lessons = this.acadeliegolfService.getFromPage(dom);

    return lessons;
  }
}
