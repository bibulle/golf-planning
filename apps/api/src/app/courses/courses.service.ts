import { Course, COUSES_MOCK, User } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { AcademiegolfService } from './academiegolf.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  NB_DAYS_PLANNING = 5;

  planning: Course[] = [];

  constructor(private userService: UsersService, private acadeliegolfService: AcademiegolfService, private eventService: EventsService, private configService: ConfigService) {
    this.handleCron();
  }

  getData(): Course[] {
    return this.planning;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  //@Cron(CronExpression.EVERY_30_SECONDS)
  //@Interval(10000)
  handleCron() {
    this.logger.debug('Called every 10 minutes');
    const users: User[] = this.userService.readFromEnv();
    this.logger.debug(`Found ${users.length} users`);

    if (this.configService.get(`USE_COURSE_MOCK`) && /true/i.test(this.configService.get(`USE_COURSE_MOCK`))) {
      this.logger.warn('Using course mock !!!');
      this.planning = COUSES_MOCK;
      return;
    }

    (async () => {
      // get planning
      let planning: Course[] = [];
      for (let i = 0; i < this.NB_DAYS_PLANNING; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        this.logger.debug(i);
        const lessons = await this.getPlanningGlobal(users[0], date).catch((reason) => {
          this.logger.error(reason);
        });
        if (!lessons) {
          break;
        }

        //this.logger.debug(`AVANT ${lessons.length} -> ${planning.length}`);
        planning = [...planning, ...lessons];
        //this.logger.debug(`APRES ${lessons.length} -> ${planning.length}`);
      }

      // test differences
      if (JSON.stringify(planning) !== JSON.stringify(this.planning)) {
        this.planning = planning;
        this.eventService.courseUpdated();
      }

      planning.forEach((p) => {
        this.logger.debug(`${p.title} : ${p.date.toLocaleDateString()} ${p.hour} (${p.prof})`);
      });

      users.forEach((u) => {
        this.logger.debug(u.academiergolf_login);
      });
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
