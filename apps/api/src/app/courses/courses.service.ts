import { Course, COURSE_MOCK, PLANNING_MOCK, User, ServiceStatus, USERS_MOCK } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { AcademiegolfService } from './academiegolf.service';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { PushNotificationService } from '../utils/push-notification.service';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  private static readonly CRON_GOLF_FORCE_DEFAULT = CronExpression.EVERY_DAY_AT_4AM;
  private static readonly CRON_GOLF_RECURRING_DEFAULT = CronExpression.EVERY_10_MINUTES;
  private static cronGolfForce = CoursesService.CRON_GOLF_FORCE_DEFAULT;
  private static cronGolfRecurrent = CoursesService.CRON_GOLF_RECURRING_DEFAULT;

  NB_DAYS_PLANNING = 25;

  planning: Course[] = [];
  courses: Course[] = [];
  users: User[] = [];

  usersStatus: { [user_name: string]: ServiceStatus } = {};

  courseStatus: ServiceStatus = { ok: false };

  constructor(
    private userService: UsersService,
    private academiegolfService: AcademiegolfService,
    private eventService: EventsService,
    private _configService: ConfigService,
    private _schedulerRegistry: SchedulerRegistry,
    private _pushNotificationService: PushNotificationService
  ) {
    CoursesService.cronGolfForce = this._configService.get('CRON_GOLF_FORCE', CoursesService.CRON_GOLF_FORCE_DEFAULT);
    CoursesService.cronGolfRecurrent = this._configService.get('CRON_GOLF_RECURRING', CoursesService.CRON_GOLF_RECURRING_DEFAULT);
    this.logger.debug(`cronGolfRecurrent : ${CoursesService.cronGolfRecurrent}`);
    this.logger.debug(`cronGolfForce     : ${CoursesService.cronGolfForce}`);

    const job1 = new CronJob(CoursesService.cronGolfRecurrent, () => {
      this.handle10MinutesCron();
    });
    this._schedulerRegistry.addCronJob('cronGolfRecurrent', job1);
    job1.start();
    const job2 = new CronJob(CoursesService.cronGolfForce, () => {
      this.handleDailyCron();
    });
    this._schedulerRegistry.addCronJob('cronGolfForce', job2);
    job2.start();

    this.users = this.userService.readFromEnv();
    this.eventService.userUpdated();

    this.users.forEach((u) => {
      this.usersStatus[u.displayName] = { ok: false };
    });

    // load course at startup
    this.loadAllGolfCourses();
  }

  getPlanning(): Course[] {
    return this.planning;
  }
  getCourse(user?: string): Course[] {
    // this.logger.debug(`getCourse(${user})`);
    return this.courses.filter((c) => {
      return !user || c.users.some((u) => u.displayName === user);
    });
  }
  getUsers(): User[] {
    return this.users;
  }

  // @Cron(CoursesService.cronGolfForce)
  handleDailyCron() {
    this.loadAllGolfCourses();
  }

  // @Cron(CoursesService.cronGolfRecurrent)
  handle10MinutesCron() {
    // If there is someone connected, update
    if (this.eventService.geConnectedClientCount() > 0) {
      this.loadAllGolfCourses();
    }
  }

  loadAllGolfCourses() {
    this.logger.log('loadAllGolfCourses');

    // Get academiegolf users
    this.logger.debug(`Found ${this.users.length} users`);

    if (this._configService.get(`USE_COURSE_MOCK`) && /true/i.test(this._configService.get(`USE_COURSE_MOCK`))) {
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

      let lastDayPlanning: Date;
      let lastDayCourse = new Date(0);

      // get courses catalogue from the golfs
      loop1: for (let i = 0; i < this.NB_DAYS_PLANNING; i++) {
        const date = new Date();
        date.setHours(12);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() + i);
        // this.logger.debug(`${i} : ${date}`);

        for (let j = 0; j < this.users.length; j++) {
          const u = this.users[j];
          //this.logger.debug(i);
          const lessons = await this.getPlanningGlobal(u, date).catch((reason) => {
            this.logger.error(reason);
            this.courseStatus.error = reason;
          });
          if (!lessons) {
            lastDayPlanning = new Date(date);
            lastDayPlanning.setDate(lastDayPlanning.getDate() - 1);
            break loop1;
          }

          lessons.forEach((c) => {
            planningTabs[Course.getKey(c)] = c;
          });
        }
      }

      // this.logger.debug(`last day : ${lastDayPlanning.getDay()} ${lastDayPlanning}`);

      if (Object.keys(planningTabs).length != 0) {
        this.courseStatus.ok = true;
        this.courseStatus.lastLoad = new Date();
        this.courseStatus.count = Object.keys(planningTabs).length;
        this.courseStatus.error = undefined;
      } else {
        this.courseStatus.ok = false;
      }

      // get users course
      await Promise.all(
        this.users.map(async (u) => {
          const lessons = await this.getPlanningUser(u).catch((reason) => {
            this.logger.error(reason);
            this.usersStatus[u.displayName].ok = false;
            this.usersStatus[u.displayName].error = reason;
          });
          //this.logger.debug(JSON.stringify(lessons,null,2));
          if (lessons) {
            this.usersStatus[u.displayName].lastLoad = new Date();
            this.usersStatus[u.displayName].ok = true;
            this.usersStatus[u.displayName].error = undefined;
            this.usersStatus[u.displayName].count = lessons.length;
            lessons.forEach((l) => {
              // add users to course in planning
              if (planningTabs[Course.getKey(l)]) {
                const nu = new User(u.displayName, u.academiegolf_index, u.academiegolf_userId);
                nu.academiegolf_index = u.academiegolf_index;
                planningTabs[Course.getKey(l)].users.push(nu);
                //this.logger.debug(`${Course.getKey(l)} -> ${u.academiegolf_index} ${u.displayName}`);
                //this.logger.debug(JSON.stringify(planningTabs[l.getKey()], null, 2));
                //this.logger.debug(`${l.getKey()} ${JSON.stringify(planningTabs[l.getKey()])}`)
              }

              if (!coursesTabs[Course.getKey(l)]) {
                coursesTabs[Course.getKey(l)] = l;
              }
              coursesTabs[Course.getKey(l)].users.push(new User(u.displayName, u.academiegolf_index));

              if (coursesTabs[Course.getKey(l)].date > lastDayCourse) {
                lastDayCourse = coursesTabs[Course.getKey(l)].date;
                // this.logger.debug(`lastDayCourse ${lastDayCourse}`)
              }
            });
          }
        })
      );

      // Si les cours du samedi ou du dimanche viennent d’apparaître
      if (lastDayPlanning.getDay() === 0 || lastDayPlanning.getDay() === 6) {
        // si le dernier cours enregistré est a moins d'un jour du last, on ne fait rien
        const diff = Math.abs(lastDayCourse.getTime() - lastDayPlanning.getTime());
        this.logger.debug(`${lastDayPlanning.toDateString()} ${lastDayCourse.toDateString()} ${diff} ${diff / (24 * 60 * 60 * 1000)}`);
        if (diff > 24 * 60 * 60 * 1000) {
          this._pushNotificationService.sendNotification(`Les cours du ${lastDayPlanning.toLocaleDateString()} sont disponibles`);
        }
      }

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
    const dom = await this.academiegolfService.getPlanningGlobalPage(user, date);

    if (!dom) {
      return undefined;
    }

    const lessons = this.academiegolfService.getFromPage(dom, date);

    return lessons;
  }

  /**
   * Get a planning for a user
   * @returns
   */
  private async getPlanningUser(user: User): Promise<Course[]> {
    const dom = await this.academiegolfService.getPlanningUserPage(user);

    if (!dom) {
      return undefined;
    }

    const lessons = this.academiegolfService.getFromPage(dom);
    // console.log(lessons);
    return lessons;
  }

  async registerUser(courseId: string, golfId: string, userIndex: number): Promise<string> {
    // cherche le user et le cours
    const user: User = this.users.find((u) => u.academiegolf_index === userIndex);
    if (!user) {
      return Promise.reject(`Utilisateur non trouvé (${userIndex})`);
    }

    const course: Course = this.planning.find((c) => c.golf_evt_id === courseId && c.golf_id === golfId);
    if (!course) {
      return Promise.reject(`Cours non trouvé (${courseId})`);
    }

    if (this._configService.get(`USE_COURSE_MOCK`) && /true/i.test(this._configService.get(`USE_COURSE_MOCK`))) {
      this.logger.warn('Using course mock !!!');
      course.users.push(new User(user.displayName, user.academiegolf_index, user.academiegolf_userId));
      this.eventService.planningUpdated();
      this.eventService.courseUpdated();
      this.loadAllGolfCourses();
      return Promise.resolve('Success (with mock)');
    }

    this.academiegolfService
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
          course.users.push(new User(user.displayName, user.academiegolf_index, user.academiegolf_userId));
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

  async deRegisterUser(courseId: string, golfId: string, userIndex: number): Promise<string> {
    // cherche le user et le cours
    const user: User = this.users.find((u) => u.academiegolf_index === userIndex);
    if (!user) {
      return Promise.reject(`Utilisateur non trouvé (${userIndex})`);
    }

    const course: Course = this.planning.find((c) => c.golf_evt_id === courseId && c.golf_id === golfId);
    if (!course) {
      return Promise.reject(`Cours non trouvé (${courseId})`);
    }

    if (this._configService.get(`USE_COURSE_MOCK`) && /true/i.test(this._configService.get(`USE_COURSE_MOCK`))) {
      this.logger.warn('Using course mock !!!');
      course.users = course.users.filter((u) => u.academiegolf_index !== user.academiegolf_index);
      this.eventService.planningUpdated();
      this.eventService.courseUpdated();
      this.loadAllGolfCourses();
      return Promise.resolve('Success (with mock)');
    }

    this.academiegolfService
      .deRegisterUser(course, user)
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
          course.users = course.users.filter((u) => u.academiegolf_index !== user.academiegolf_index);
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

  getUsersStatus(): Promise<{ [user_name: string]: ServiceStatus }> {
    return Promise.resolve(this.usersStatus);
  }
  getCoursesStatus(): Promise<ServiceStatus> {
    return Promise.resolve(this.courseStatus);
  }
}
