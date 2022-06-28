import got from 'got/dist/source';
import { Club, Parcours, ParcoursResa, User } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { CookieJar, JSDOM } from 'jsdom';

@Injectable()
export class ChronogolfService {
  private readonly logger = new Logger(ChronogolfService.name);

  private static readonly URL = 'https://www.chronogolf.fr/dashboard/#/reservations';
  private static readonly URL_CON = 'https://www.chronogolf.fr/private_api/sessions';
  private static readonly URL_COURSE = 'https://www.chronogolf.fr/private_api/courses/';
  private static readonly URL_CLUB = 'https://www.chronogolf.fr/private_api/clubs/';

  // https://www.chronogolf.fr/dashboard/#/reservations
  // POST https://www.chronogolf.fr/private_api/sessions payload : {session: {email: "user", password: "password"}}
  // https://www.chronogolf.fr/marketplace/users/9243104/reservations?page=1&per_page=10&status=past&user_id=9243104
  // https://www.chronogolf.fr/marketplace/users/9243104/reservations?page=1&per_page=10&status=upcoming&user_id=9243104
  // get https://www.chronogolf.fr/private_api/courses/19628

  cookiesJars: { [id: string]: CookieJar } = {};

  userIds: { [id: string]: string } = {};

  parcours: { [id: string]: Promise<Parcours> } = {};
  clubs: { [id: string]: Promise<Club> } = {};

  async getPlanningUserPage(user: User): Promise<ParcoursResa[]> {
    return new Promise<ParcoursResa[]>((resolve, rejects) => {
      this.logger.debug('getPlanningUserPage');

      const cookieJar = this.getCookieJar(user.chronogolf_login);
      // this.logger.debug(cookieJar.getCookiesSync('https://www.chronogolf.fr/'));

      // First, load dashboard
      const url = 'https://www.chronogolf.fr/dashboard/';
      got(url, {
        cookieJar,
      })
        .then(async (response) => {
          // If not authenticate, do it
          if (!this.userIds[user.chronogolf_login] || (response && response.redirectUrls && response.redirectUrls.indexOf('/login') >= 0)) {
            await this.authenticate(user)
              .then(() => {
                this.logger.debug('chronogolf authentication OK');
              })
              .catch((err) => {
                this.logger.debug('chronogolf authentication KO');
                this.logger.error(err);
              });
          }
          // we got a user Id, get the planning
          if (this.userIds[user.chronogolf_login]) {
            const url1 = `https://www.chronogolf.fr/marketplace/users/${this.userIds[user.chronogolf_login]}/reservations?page=1&per_page=10&status=past&user_id=${
              this.userIds[user.chronogolf_login]
            }`;
            const url2 = `https://www.chronogolf.fr/marketplace/users/${this.userIds[user.chronogolf_login]}/reservations?page=1&per_page=10&status=upcoming&user_id=${
              this.userIds[user.chronogolf_login]
            }`;
            //this.logger.debug(url1);
            await Promise.all([got(url1, { cookieJar }).json() as Promise<[]>, got(url2, { cookieJar }).json() as Promise<[]>])
              .then(async (values) => {
                // this.logger.debug(JSON.stringify(values));
                const lists = values.flat().map((v: any) => {
                  return new ParcoursResa(v);
                });

                const promises = [];

                lists.forEach((v: ParcoursResa) => {
                  promises.push(
                    new Promise<void>((resolve, reject) => {
                      this.getParcours(v.course_id, user)
                        .then((p) => {
                          v.course = p;
                          resolve();
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    }) 
                  );
                  promises.push(
                    new Promise<void>((resolve, reject) => {
                      this.getClub(v.club_id, user)
                        .then((c) => {
                          v.club = c;
                          resolve();
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    }) 
                  );
                });

                await Promise.all(promises);
                resolve(lists);
              })
              .catch((reason) => {
                this.logger.error(reason);
                rejects('Cannot connect to Chrono Golf!!');
              });
          } else {
            rejects('Authentication issue');
          }
        })
        .catch((reason) => {
          this.logger.error(reason);
          rejects('Cannot connect to Chrono Golf!!');
        });
    });
  }

  /**
   * Authenticate
   */
  async authenticate(user: User): Promise<void> {
    this.logger.debug('authenticate');

    return new Promise<void>((resolve, reject) => {
      const cookieJar = this.getCookieJar(user.chronogolf_login);
      // Fetch the connection URL
      // this.logger.debug('Fetch : ' + ChronogolfService.URL_CON);
      got
        .post(ChronogolfService.URL_CON, {
          followRedirect: true,
          cookieJar,
          json: { session: { email: user.chronogolf_login, password: user.chronogolf_password } },
        })
        .json()
        .then((response) => {
          // this.logger.debug(cookieJar.getCookiesSync('https://www.chronogolf.fr/'));
          // this.logger.debug(`${response.statusCode} -> ${response.headers.location}`);

          if (response && response['id']) {
            this.userIds[user.chronogolf_login] = response['id'];
            resolve();
          } else {
            reject(`Authentication refused (${user.displayName})`);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private getCookieJar(name: string): CookieJar {
    if (!this.cookiesJars[name]) {
      this.cookiesJars[name] = new CookieJar();
    }

    return this.cookiesJars[name];
  }
  private genrateRandomString(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  getParcours(id: number, user: User): Promise<Parcours> {
    if (!this.parcours[id]) {
      this.loadParcours(id, user);
    }
    return this.parcours[id];
  }
  getClub(id: number, user: User): Promise<Club> {
    if (!this.clubs[id]) {
      this.loadClub(id, user);
    }
    return this.clubs[id];
  }

  loadParcours(id: number, user: User) {
    this.logger.debug(`loadParcours(${id})`);

    const url = `${ChronogolfService.URL_COURSE}${id}`;

    const cookieJar = this.getCookieJar(user.chronogolf_login);

    this.parcours[id] = new Promise<Parcours>((resolve, reject) => {
      got(url, { cookieJar })
        .json()
        .then((v) => {
          resolve(new Parcours(v));
        })
        .catch((err) => {
          reject(err);
        });
    });

    // this.logger.debug(JSON.stringify(val));

    // this.parcours[id] = new Parcours(val);
  }
  loadClub(id: number, user: User) {
    this.logger.debug(`loadClub(${id})`);

    const url = `${ChronogolfService.URL_CLUB}${id}`;

    const cookieJar = this.getCookieJar(user.chronogolf_login);

    this.clubs[id] = new Promise<Club>((resolve, reject) => {
      got(url, { cookieJar })
        .json()
        .then((v) => {
          resolve(new Club(v));
        })
        .catch((err) => {
          reject(err);
        });
    });

    // this.logger.debug(JSON.stringify(val));

    // this.parcours[id] = new Parcours(val);
  }
}
