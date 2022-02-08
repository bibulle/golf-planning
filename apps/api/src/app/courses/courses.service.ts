import { Course, COURSE_MOCK, PLANNING_MOCK, User, USERS_MOCK } from '@golf-planning/api-interfaces';
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
  users: User[] = [];

  constructor(private userService: UsersService, private acadeliegolfService: AcademiegolfService, private eventService: EventsService, private configService: ConfigService) {
    this.users = this.userService.readFromEnv();
    this.eventService.userUpdated();

    // load course at startup
    this.loadAllGolfCourses();
  }

  getPlanning(): Course[] {
    return this.planning;
  }
  getCourse(user?: string): Course[] {
    return this.courses.filter((c) => {
      return !user || c.users.some((u) => u.displayName === user);
    });
  }
  getUsers(): User[] {
    return this.users;
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  handleDailyCron() {
    this.loadAllGolfCourses();
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  @Cron(CronExpression.EVERY_10_MINUTES)
  handle10MinutesCron() {
    // If there is someone connected, update
    if (this.eventService.geConnectedClientCount() > 0) {
      this.loadAllGolfCourses();
    }
  }

  loadAllGolfCourses() {
    this.logger.log('loadAllGolfCourses');

    // Get academigolf users
    this.logger.debug(`Found ${this.users.length} users`);

    if (this.configService.get(`USE_COURSE_MOCK`) && /true/i.test(this.configService.get(`USE_COURSE_MOCK`))) {
      this.logger.warn('Using course mock !!!');

      setTimeout(() => {
        this.fillAndCompareCourses(PLANNING_MOCK, COURSE_MOCK);
        this.users = USERS_MOCK;
      }, 5000);
      return;
    }

    (async () => {
      const planningTabs: { [key: string]: Course } = {};
      const coursesTabs: { [key: string]: Course } = {};

      // get courses catalogue from the golfs
      loop1: for (let i = 0; i < this.NB_DAYS_PLANNING; i++) {
        const date = new Date();
        date.setHours(12);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() + i);

        for (let j = 0; j < this.users.length; j++) {
          const u = this.users[j];
          //this.logger.debug(i);
          const lessons = await this.getPlanningGlobal(u, date).catch((reason) => {
            this.logger.error(reason);
          });
          if (!lessons) {
            break loop1;
          }

          lessons.forEach((c) => {
            planningTabs[Course.getKey(c)] = c;
          });
        }
      }

      // get users course
      await Promise.all(
        this.users.map(async (u) => {
          const lessons = await this.getPlanningUser(u).catch((reason) => {
            this.logger.error(reason);
          });
          //this.logger.debug(JSON.stringify(lessons,null,2));
          if (lessons) {
            lessons.forEach((l) => {
              // add users to course in planning
              if (planningTabs[Course.getKey(l)]) {
                const nu = new User(u.displayName, u.academiergolf_index, u.academiergolf_userid);
                nu.academiergolf_index = u.academiergolf_index;
                planningTabs[Course.getKey(l)].users.push(nu);
                //this.logger.debug(`${Course.getKey(l)} -> ${u.academiergolf_index} ${u.displayName}`);
                //this.logger.debug(JSON.stringify(planningTabs[l.getKey()], null, 2));
                //this.logger.debug(`${l.getKey()} ${JSON.stringify(planningTabs[l.getKey()])}`)
              }

              if (!coursesTabs[Course.getKey(l)]) {
                coursesTabs[Course.getKey(l)] = l;
              }
              coursesTabs[Course.getKey(l)].users.push(new User(u.displayName, u.academiergolf_index));
            });
          }
        })
      );

      this.fillAndCompareCourses(Object.values(planningTabs), Object.values(coursesTabs));
      // console.log(JSON.stringify(this.users));

      // planning.forEach((p) => {
      //   this.logger.debug(`${p.title} : ${p.date.toLocaleDateString()} ${p.hour} (${p.prof})`);
      // });
    })();
  }

  private fillAndCompareCourses(newPlanning: Course[], newCourses: Course[]) {
    // try to use same objects
    const planningTabs: { [key: string]: Course } = {};
    newPlanning.forEach((course) => {
      planningTabs[Course.getKey(course)] = course;
    });
    newCourses = newCourses.map((course) => {
      if (planningTabs[Course.getKey(course)]) {
        return planningTabs[Course.getKey(course)];
      } else {
        return course;
      }
    });

    // Sort the courses
    newPlanning = newPlanning.sort((a, b) => {
      return Course.getKey(a).localeCompare(Course.getKey(b));
    });
    newCourses = newCourses.sort((a, b) => {
      return Course.getKey(a).localeCompare(Course.getKey(b));
    });

    const coursesIds: { [key: string]: { golf_evt_id: string; golf_id: string } } = {};

    // get ids
    newPlanning
      .concat(newCourses)
      .filter((course) => {
        return course.golf_evt_id && course.golf_id;
      })
      .forEach((course) => {
        coursesIds[Course.getKey(course)] = { golf_evt_id: course.golf_evt_id, golf_id: course.golf_id };
      });

    // fill ids
    newPlanning
      .concat(newCourses)
      .filter((course) => {
        return !course.golf_evt_id || !course.golf_id;
      })
      .forEach((course) => {
        if (coursesIds[Course.getKey(course)]) {
          course.golf_evt_id = coursesIds[Course.getKey(course)].golf_evt_id;
          course.golf_id = coursesIds[Course.getKey(course)].golf_id;
        }
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

  async registerUser(courseId: string, golfId: string, userIndex: number): Promise<string> {
    // cherche le user et le cours
    const user: User = this.users.find((u) => u.academiergolf_index === userIndex);
    if (!user) {
      return Promise.reject(`Utilisateur non trouvé (${userIndex})`);
    }

    const course: Course = this.planning.find((c) => c.golf_evt_id === courseId && c.golf_id === golfId);
    if (!course) {
      return Promise.reject(`Cours non trouvé (${courseId})`);
    }

    if (this.configService.get(`USE_COURSE_MOCK`) && /true/i.test(this.configService.get(`USE_COURSE_MOCK`))) {
      this.logger.warn('Using course mock !!!');
      course.users.push(new User(user.displayName, user.academiergolf_index, user.academiergolf_userid));
      this.eventService.planningUpdated();
      this.eventService.courseUpdated();
      this.loadAllGolfCourses();
      return Promise.resolve('Success (with mock)');
    }

    this.acadeliegolfService
      .registerUser(course, user)
      .catch((err) => {
        Promise.reject(err);
      })
      .then((dom) => {
        if (!dom) {
          this.logger.error('Dom is not defined');
          return Promise.reject('Something go wrong !!');
        }

        if (dom.window.document.querySelector('.reveal-modal-err')) {
          return Promise.reject(dom.window.document.querySelector('.reveal-modal-err').textContent);
        } else if (dom.window.document.querySelector('.reveal-modal-ok')) {
          course.users.push(new User(user.displayName, user.academiergolf_index, user.academiergolf_userid));
          this.eventService.planningUpdated();
          this.eventService.courseUpdated();
          this.loadAllGolfCourses();

          return Promise.resolve(dom.window.document.querySelector('.reveal-modal-ok').textContent);
        } else {
          this.logger.error('Dom has no reveal-modal tag');
          return Promise.reject('Something go wrong !!');
        }
        // this.logger.debug(dom.window.document.body.textContent);
        // Promise.resolve();
      });
  }
}
