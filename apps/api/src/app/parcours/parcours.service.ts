import { ParcoursResa, User, USERS_MOCK, PARCOURS_RESA_MOCK, ServiceStatus } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { ChronogolfService } from './chronogolf.service';

@Injectable()
export class ParcoursService {
  private readonly logger = new Logger(ParcoursService.name);

  private static readonly CRON_GOLF_FORCE_DEFAULT = CronExpression.EVERY_DAY_AT_4AM;
  private static readonly CRON_GOLF_RECURRING_DEFAULT = CronExpression.EVERY_10_MINUTES;
  private static cronGolfForce = ParcoursService.CRON_GOLF_FORCE_DEFAULT;
  private static cronGolfRecurrent = ParcoursService.CRON_GOLF_RECURRING_DEFAULT;

  planning: ParcoursResa[] = [];
  users: User[] = [];

  usersStatus: { [user_name: string]: ServiceStatus } = {};

  constructor(
    private userService: UsersService,
    private chronogolfService: ChronogolfService,
    private eventService: EventsService,
    private _configService: ConfigService,
    private _schedulerRegistry: SchedulerRegistry
  ) {
    ParcoursService.cronGolfForce = this._configService.get('CRON_GOLF_FORCE', ParcoursService.CRON_GOLF_FORCE_DEFAULT);
    ParcoursService.cronGolfRecurrent = this._configService.get('CRON_GOLF_RECURRING', ParcoursService.CRON_GOLF_RECURRING_DEFAULT);
    this.logger.debug(`cronGolfParcoursRecurrent : ${ParcoursService.cronGolfRecurrent}`);
    this.logger.debug(`cronGolfParcoursForce     : ${ParcoursService.cronGolfForce}`);

    const job1 = new CronJob(ParcoursService.cronGolfRecurrent, () => {
      this.handle10MinutesCron();
    });
    this._schedulerRegistry.addCronJob('cronGolfParcoursRecurrent', job1);
    job1.start();
    const job2 = new CronJob(ParcoursService.cronGolfForce, () => {
      this.handleDailyCron();
    });
    this._schedulerRegistry.addCronJob('cronGolfParcoursForce', job2);
    job2.start();

    this.users = this.userService.readFromEnv();
    this.eventService.userUpdated();

    this.users.forEach((u) => {
      this.usersStatus[u.displayName] = { ok: false };
    });

    // load course at startup
    this.loadAllGolfParcours();
  }

  getParcours(): ParcoursResa[] {
    return this.planning;
  }

  // @Cron(CoursesService.cronGolfForce)
  handleDailyCron() {
    this.loadAllGolfParcours();
  }

  // @Cron(CoursesService.cronGolfRecurrent)
  handle10MinutesCron() {
    // If there is someone connected, update
    if (this.eventService.geConnectedClientCount() > 0) {
      this.loadAllGolfParcours();
    }
  }

  loadAllGolfParcours() {
    this.logger.log('loadAllGolfParcours');

    if (this._configService.get(`USE_PARCOURS_MOCK`) && /true/i.test(this._configService.get(`USE_PARCOURS_MOCK`))) {
      this.logger.warn('Using parcours mock !!!');

      setTimeout(() => {
        this.fillAndCompareParcours(PARCOURS_RESA_MOCK);
        this.users = USERS_MOCK;
      }, 5000);
      return;
    }

    const parcoursTabs: { [key: string]: ParcoursResa } = {};

    // this.logger.log(this.users);

    (async () => {
      await Promise.all(
        this.users
          .filter((u) => {
            // this.logger.debug(`${u.displayName} : ${u.chronogolf_login}`);
            return u.chronogolf_login !== undefined;
          })
          .map(async (u) => {
            // this.logger.debug(`${u.displayName} : ${u.chronogolf_login}`);
            const parcours = await this.getPlanningUser(u).catch((reason) => {
              this.logger.error(reason);
              this.usersStatus[u.displayName].ok = false;
              this.usersStatus[u.displayName].error = reason;  
            });
            // this.logger.debug(JSON.stringify(parcours));

            if (parcours) {
              this.usersStatus[u.displayName].lastLoad = new Date();
              this.usersStatus[u.displayName].ok = true;
              this.usersStatus[u.displayName].error = undefined;
              this.usersStatus[u.displayName].count = parcours.length;

              parcours.forEach((p) => {
                if (!parcoursTabs[ParcoursResa.getKey(p)]) {
                  parcoursTabs[ParcoursResa.getKey(p)] = p;
                }
                parcoursTabs[ParcoursResa.getKey(p)].users.push(new User(u.displayName, u.academiegolf_index));
              });
            }
          })
      );

      this.fillAndCompareParcours(Object.values(parcoursTabs));
    })();
  }

  /**
   * Get a planning for a user
   * @returns
   */
  private async getPlanningUser(user: User): Promise<ParcoursResa[]> {
    return this.chronogolfService.getPlanningUserPage(user);
  }

  private fillAndCompareParcours(newPlanning: ParcoursResa[] | void) {
    if (newPlanning) {
      // Sort the courses
      newPlanning = newPlanning.sort((a, b) => {
        return ParcoursResa.getKey(a).localeCompare(ParcoursResa.getKey(b));
      });

      // this.logger.debug(JSON.stringify(newPlanning));

      // test differences
      if (JSON.stringify(newPlanning) !== JSON.stringify(this.planning)) {
        this.planning = newPlanning;
        // this.logger.debug(JSON.stringify(this.planning));
        this.eventService.parcoursUpdated();
      }
    }
  }

  getUsersStatus(): Promise<{ [user_name: string]: ServiceStatus }> {
    return Promise.resolve(this.usersStatus);
  }

}
