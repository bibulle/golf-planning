import got from 'got/dist/source';
//import got from 'got';
import { JSDOM, CookieJar } from 'jsdom';
import { Course, User } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AcademiegolfService {
  private readonly logger = new Logger(AcademiegolfService.name);

  private static readonly URL = 'https://academiegolf.com/fr/la-ramee/planning';
  private static readonly URL_MY_COURS = 'https://academiegolf.com/fr/la-ramee/mes-informations?tab=1';
  private static readonly URL_CON = 'https://academiegolf.com/fr/la-ramee/connexion.html';

  cookiesJars: { [id: string]: CookieJar } = {};

  async getPlanningGlobalPage(user: User, date: Date): Promise<JSDOM> {
    return this.getPlanningPage(AcademiegolfService.URL, user, date);
  }

  async getPlanningUserPage(user: User): Promise<JSDOM> {
    return this.getPlanningPage(AcademiegolfService.URL_MY_COURS, user);
  }

  async getPlanningPage(startURL: string, user: User, date?: Date): Promise<JSDOM> {
    // this.logger.debug(`getPlanningPage(${startURL}, ${user.academiergolf_login}, ${date})`);
    // Build URL
    let formatedDate: string;
    let url = startURL;
    if (date) {
      formatedDate = `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
      url = `${url}/${formatedDate}`;
    }

    const cookieJar = this.getCookieJar(user.academiergolf_login);

    // Fetch the url
    //this.logger.debug('Fetch : ' + url);
    const response = await got(url, { cookieJar }).catch((reason) => {
      this.logger.error(reason);
      return Promise.reject('Cannot connect to Academie Golf!!');
    });
    //this.logger.debug('Fetch : ' + url + '  done');

    let dom = new JSDOM(response.body);

    // if auth button found, try to authenticate
    if (dom.window.document.querySelector('#auth')) {
      //this.logger.debug('Authentification');
      await this.authenticate(user);
      //this.logger.debug('Authentification done');

      // refetch the URL
      //this.logger.debug('Fetch : ' + url);
      const response = await got(url, { cookieJar }).catch((reason) => {
        this.logger.error('ERROR');
        this.logger.error(reason);
        return Promise.reject('Cannot connect to Academie Golf!!');
      });
      //this.logger.debug('Fetch : ' + url + '  done');

      dom = new JSDOM(response.body);
    }

    if (dom.window.document.querySelector('#auth')) {
      return Promise.reject('Cannot authenticate to Academie Golf!!');
    }

    // Verify if tit's the good date
    if (date) {
      const returnedDate = dom.window.document.querySelector('#planning-modal-redirect')['value'];
      if (returnedDate != formatedDate) {
        this.logger.debug(`last day is ${returnedDate}`);
        return undefined;
      }
    }

    return dom;
  }

  /**
   * Authenticate
   */
  async authenticate(user: User): Promise<string> {
    // Should be good later on
    // const formData = new FormData();
    // formData.set("login", "famille.martin%40gmail");
    // formData.set("password", "Unqm48GHDdZmjQ5");
    // formData.set("auth", "1");

    //const formEncoder = new FormDataEncoder(formData);

    // Temporary solution (build body and header "manually")
    const headers = {
      'content-type': 'multipart/form-data; boundary=--------------------------213180058186369588740620',
    };
    const body = `----------------------------213180058186369588740620
        Content-Disposition: form-data; name="login"
        
        ${user.academiergolf_login}
        ----------------------------213180058186369588740620
        Content-Disposition: form-data; name="password"
        
        ${user.academiergolf_password}
        ----------------------------213180058186369588740620
        Content-Disposition: form-data; name="auth"
        
        1
        ----------------------------213180058186369588740620--
        `.replace(/^[ \t]*/gm, '');

    const cookieJar = this.getCookieJar(user.academiergolf_login);

    // Fetch the connection URL
    //this.logger.debug('Fetch : ' + AcademiegolfService.URL_CON);
    const response = await got.post(AcademiegolfService.URL_CON, {
      followRedirect: true,
      cookieJar,
      body: body,
      headers: headers,
      // form: {
      //   login: "famille.martin@gmail",
      //   password: "Unqm48GHDdZmjQ5",
      //   auth: 1,
      // },
      hooks: {
        // beforeRequest: [
        //   (options) => {
        //     this.logger.debug("BEFORE");
        //     this.logger.debug(options.headers);
        //     this.logger.debug(options.body);
        //   },
        // ],
        // beforeRedirect: [
        //   (options, response) => {
        //     this.logger.debug(`REDIRECT ${response.statusCode} -> ${response.headers.location}`);
        //   },
        // ],
      },
    });
    //this.logger.debug('Fetch : ' + AcademiegolfService.URL_CON + '  done');

    //   debug(cookieJar.getCookiesSync("https://academiegolf.com/"));
    //   debug(`${response.statusCode} -> ${response.headers.location}`);

    return response.body;
  }

  getFromPage(dom: JSDOM, date?: Date): Course[] {
    const lessons: Course[] = [];

    // Look in the planning
    dom.window.document.querySelectorAll('.r-lessons .r-lessons-list .r-lesson-block').forEach((lesson) => {
      const hour = this.getTagContent(lesson, '.r-info-hours').replace(/ .*$/, '');
      const title = this.getTagContent(lesson, '.r-info-title');
      const prof = this.getTagContent(lesson, '.r-pro-title');
      const place = this.getTagContent(lesson, '.r-info-remaining span');

      if (hour) {
        lessons.push(new Course(date, hour, title, prof, +place));
        //this.logger.debug(lessons[lessons.length-1].getKey())
      }

      //this.logger.debug(`${date.toLocaleDateString()} ${hour} : ${title} ${prof} (${place} place)`);
    });

    // Look in "my course"
    dom.window.document.querySelectorAll('.r-lesson-block').forEach((lesson) => {
      let date: Date;
      let hour = "";
      let prof = "";
      if (lesson.querySelector('.r-block-info.col-lg-8 a')) {
        const dateStr = lesson.querySelector('.r-block-info a')['href'].replace(/^.*\/([^\/]*)$/, '$1');
        const dateTab = dateStr.split('-');
        date = new Date(dateTab[2], dateTab[1] - 1, dateTab[0], 12, 0, 0);
        hour = this.getTagContent(lesson, '.r-info-hours').replace(/ .*$/, '');
        prof = this.getTagContent(lesson, '.r-pro-title');
      } else if (lesson.querySelector('.r-content-title')) {
        date = this.parseDate(this.getTagContent(lesson, '.r-content-title'));
        hour = this.parseHour(this.getTagContent(lesson, '.r-content-title'));
        prof = this.getTagContent(lesson, '.r-info-hours').replace(/.*: /, '');
      }

      
      const title = this.getTagContent(lesson, '.r-info-title');
     
      const place = this.getTagContent(lesson, '.r-info-remaining span');

      if (date && !isNaN(date.getTime())) {
        // debug(`${date.toLocaleDateString()} ${hour} : ${title} ${prof} (${place} place)`);
        lessons.push(new Course(date, hour, title, prof, +place));
      }
    });

    return lessons;
  }

  /**
   * Get the text content of a jsdom node
   * @param parentNode
   * @param selector
   * @returns
   */
  private getTagContent(parentNode: ParentNode, selector: string): string {
    const node = parentNode.querySelector(selector);
    if (node) {
      return node.textContent;
    } else {
      return '';
    }
  }

  private getCookieJar(name: string): CookieJar {
    if (!this.cookiesJars[name]) {
      this.cookiesJars[name] = new CookieJar();
    }

    return this.cookiesJars[name];
  }

  private parseDate(str: string): Date {
    const parts = str.split(' ');

    const day = +parts[1];
    const month = this.MONTHS.indexOf(parts[2].toLocaleLowerCase());
    const year = 2000 + +parts[3];

    return new Date(year, month, day, 12, 0, 0);
  }
  private parseHour(str: string): string {
    const parts = str.split(' ');

    return parts[5].replace(/h/,":");
  }

  private MONTHS = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
}
