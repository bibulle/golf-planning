import got from 'got/dist/source';
//import got from 'got';
import { JSDOM, CookieJar } from 'jsdom';
import { Course, User } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { EventsService } from '../events/events.service';

@Injectable()
export class AcademiegolfService {
  private readonly logger = new Logger(AcademiegolfService.name);

  private static readonly URL = 'https://academiegolf.com/fr/la-ramee/planning';
  private static readonly URL_MY_COURS = 'https://academiegolf.com/fr/la-ramee/mes-informations?tab=1';
  private static readonly URL_CON = 'https://academiegolf.com/fr/la-ramee/connexion.html';
  private static readonly URL_REGISTER = 'https://academiegolf.com/includes/public/ajaxCtrl/_ajaxPlanning.php?action=eleveAddEvtPublish';
  private static readonly URL_DELETE = 'https://academiegolf.com/includes/public/ajaxCtrl/_ajaxPlanning.php?action=eleveDelEvtPublish';
  // 'eleveAddEvt','&lang=fr&golf_evt_id='+jQuery(this).attr('id')+'&guser_id=rame-011008'+'&golf_id=24'+'&datePlus=2022-01-30'+'&guser_type=eleve'

  cookiesJars: { [id: string]: CookieJar } = {};

  constructor(private eventService: EventsService) {}

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

    const cookieJar = this.getCookieJar(user.academiegolf_login);

    // Fetch the url
    // this.logger.debug('Fetch : ' + url);
    const response = await got(url, { cookieJar }).catch((reason) => {
      this.logger.error(reason);
      return Promise.reject('Cannot connect to Academie Golf!!');
    });
    // this.logger.debug('Fetch : ' + url + '  done');

    let dom = new JSDOM(response.body);

    // if auth button found, try to authenticate
    if (dom.window.document.querySelector('#auth')) {
      // this.logger.debug('Authentification');
      await this.authenticate(user);
      // this.logger.debug('Authentification done');

      // refetch the URL
      // this.logger.debug('Fetch : ' + url);
      const response = await got(url, { cookieJar }).catch((reason) => {
        this.logger.error('ERROR');
        this.logger.error(reason);
        return Promise.reject('Cannot connect to Academie Golf!!');
      });
      // this.logger.debug('Fetch : ' + url + '  done');

      dom = new JSDOM(response.body);
    }

    if (dom.window.document.querySelector('#auth')) {
      return Promise.reject('Cannot authenticate to Academie Golf!!');
    }

    // Verify if it's the good date
    if (date) {
      const returnedDate = dom.window.document.querySelector('#planning-modal-redirect')['value'];
      if (returnedDate != formatedDate) {
        this.logger.debug(`last day is ${returnedDate}`);
        return undefined;
      }
    }

    // get user_id
    if (!user.academiegolf_userId) {
      for (let index = dom.window.document.scripts.length - 1; index > -1; index--) {
        // this.logger.debug(`${index+1}/${dom.window.document.scripts.length} ${user.academiergolf_userid}`);
        const script = dom.window.document.scripts[index];
        const s = script.textContent;
        if (s.match(/guser_id=([^']*)'/)) {
          user.academiegolf_userId = s.match(/guser_id=([^']*)'/)[1];
          // this.logger.debug(`${index+1}/${dom.window.document.scripts.length} ${user.academiergolf_userid}`);
          this.eventService.userUpdated();
          break;
        }
      }
    }

    return dom;
  }

  async registerUser(course: Course, user: User): Promise<JSDOM> {
    // this.logger.debug(JSON.stringify(course, null, 2));
    // this.logger.debug(JSON.stringify(user, null, 2));

    const cookieJar = this.getCookieJar(user.academiegolf_login);

    const boundary = this.generateRandomString();
    // Temporary solution (build body and header "manually")
    const headers = {
      'content-type': `multipart/form-data; boundary=--------------------------${boundary}`,
    };
    const body = `----------------------------${boundary}
        Content-Disposition: form-data; name="golf_evt_id"
        
        ${course.golf_evt_id}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="guser_id"
        
        ${user.academiegolf_userId}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="golf_id"
        
        ${course.golf_id}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="datePlus"
        
        ${course.date.getFullYear()}-${(1 + course.date.getMonth()).toPrecision().padStart(2, '0')}-${course.date.getDate().toPrecision().padStart(2, '0')}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="guser_type"
        
        eleve
        ----------------------------${boundary}--
        `.replace(/^[ \t]*/gm, '');

    // this.logger.debug(JSON.stringify(body, null, 2));

    const response = await got
      .post(AcademiegolfService.URL_REGISTER, {
        followRedirect: true,
        cookieJar,
        body: body,
        headers: headers,
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    // this.logger.debug(JSON.stringify(response.body, null, 2));
    let dom = new JSDOM(response.body);

    if (dom.window.document.querySelector('#auth') || dom.window.document.querySelector('.reveal-modal-err')) {
      await this.authenticate(user);

      const response = await got
        .post(AcademiegolfService.URL_REGISTER, {
          followRedirect: true,
          cookieJar,
          body: body,
          headers: headers,
        })
        .catch((err) => {
          return Promise.reject(err);
        });
      // this.logger.debug(JSON.stringify(response.body, null, 2));
      dom = new JSDOM(response.body);
    }

    if (dom.window.document.querySelector('#auth')) {
      return Promise.reject('Cannot authenticate to Academie Golf!!');
    }

    // this.logger.debug(dom);
    return dom;
  }

  async deRegisterUser(course: Course, user: User): Promise<JSDOM> {
    // this.logger.debug(JSON.stringify(course, null, 2));
    // this.logger.debug(JSON.stringify(user, null, 2));

    const cookieJar = this.getCookieJar(user.academiegolf_login);

    const boundary = this.generateRandomString();
    // Temporary solution (build body and header "manually")
    const headers = {
      'content-type': `multipart/form-data; boundary=--------------------------${boundary}`,
    };
    const body = `----------------------------${boundary}
        Content-Disposition: form-data; name="golf_evt_id"
        
        ${course.golf_evt_id}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="guser_id"
        
        ${user.academiegolf_userId}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="golf_id"
        
        ${course.golf_id}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="datePlus"
        
        ${course.date.getFullYear()}-${(1 + course.date.getMonth()).toPrecision().padStart(2, '0')}-${course.date.getDate().toPrecision().padStart(2, '0')}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="guser_type"
        
        eleve
        ----------------------------${boundary}--
        `.replace(/^[ \t]*/gm, '');

    // this.logger.debug(JSON.stringify(body, null, 2));

    const response = await got
      .post(AcademiegolfService.URL_DELETE, {
        followRedirect: true,
        cookieJar,
        body: body,
        headers: headers,
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    // this.logger.debug(JSON.stringify(response.body, null, 2));
    let dom = new JSDOM(response.body);

    if (dom.window.document.querySelector('#auth') || dom.window.document.querySelector('.reveal-modal-err')) {
      await this.authenticate(user);

      const response = await got
        .post(AcademiegolfService.URL_DELETE, {
          followRedirect: true,
          cookieJar,
          body: body,
          headers: headers,
        })
        .catch((err) => {
          return Promise.reject(err);
        });
      // this.logger.debug(JSON.stringify(response.body, null, 2));
      dom = new JSDOM(response.body);
    }

    if (dom.window.document.querySelector('#auth')) {
      return Promise.reject('Cannot authenticate to Academie Golf!!');
    }

    // this.logger.debug(dom);
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

    const boundary = this.generateRandomString();

    // Temporary solution (build body and header "manually")
    const headers = {
      'content-type': `multipart/form-data; boundary=--------------------------${boundary}`,
    };
    const body = `----------------------------${boundary}
        Content-Disposition: form-data; name="login"
        
        ${user.academiegolf_login}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="password"
        
        ${user.academiegolf_password}
        ----------------------------${boundary}
        Content-Disposition: form-data; name="auth"
        
        1
        ----------------------------${boundary}--
        `.replace(/^[ \t]*/gm, '');

    const cookieJar = this.getCookieJar(user.academiegolf_login);

    // Fetch the connection URL
    //this.logger.debug('Fetch : ' + AcademiegolfService.URL_CON);
    const response = await got.post(AcademiegolfService.URL_CON, {
      followRedirect: true,
      cookieJar,
      body: body,
      headers: headers,
      // form: {
      //   login: "famille.martin@gmail",
      //   password: "sssdfdsfdsf",
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

    let golf_id = null;
    for (let index = dom.window.document.scripts.length - 1; index > -1; index--) {
      const script = dom.window.document.scripts[index];
      const s = script.textContent;
      if (s.match(/golf_id=([0-9]*)/)) {
        golf_id = s.match(/golf_id=([0-9]*)/)[1];
        break;
      }
    }

    // Look in the planning
    dom.window.document.querySelectorAll('.r-lessons .r-lessons-list .r-lesson-block').forEach((lesson) => {
      const hour = this.getTagContent(lesson, '.r-info-hours').replace(/ .*$/, '');
      const title = this.getTagContent(lesson, '.r-info-title');
      const prof = this.getTagContent(lesson, '.r-pro-title');
      const place = this.getTagContent(lesson, '.r-info-remaining span');

      let golf_evt_id = null;
      if (lesson.querySelector('.r-level-name')) {
        golf_evt_id = lesson
          .querySelector('.r-level-name')
          .getAttribute('data-target')
          .replace(/^#niv-/, '');
      }

      if (hour) {
        lessons.push(new Course(date, hour, title, prof, +place, golf_evt_id, golf_id));
        //this.logger.debug(lessons[lessons.length-1].getKey())
      }

      // this.logger.debug(`${date.toLocaleDateString()} ${hour} : ${title} ${prof} (${place} place)`);
    });

    // Look in "my course"
    dom.window.document.querySelectorAll('.r-lesson-block').forEach((lesson) => {
      let date: Date;
      let hour = '';
      let prof = '';
      if (lesson.querySelector('.r-block-info.col-lg-8 a')) {
        const dateStr = lesson.querySelector('.r-block-info a')['href'].replace(/^.*\/([^/]*)$/, '$1');
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

      let golf_evt_id = null;
      if (lesson.querySelector('.r-level-name')) {
        golf_evt_id = lesson
          .querySelector('.r-level-name')
          .getAttribute('data-target')
          .replace(/^#niv-/, '');
      }

      if (date && !isNaN(date.getTime())) {
        // debug(`${date.toLocaleDateString()} ${hour} : ${title} ${prof} (${place} place)`);
        lessons.push(new Course(date, hour, title, prof, +place, golf_evt_id, golf_id));
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

    return parts[5].replace(/h/, ':');
  }
  private generateRandomString(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private MONTHS = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
}

/*--
Request URL: https://academiegolf.com/includes/public/ajaxCtrl/_ajaxPlanning.php?action=eleveAddEvt
Request Method: POST

Query string :
  action: eleveAddEvt
Form data :
  (empty)
  lang: fr
  golf_evt_id: 1043062
  guser_id: rame-011008
  golf_id: 24
  datePlus: 2022-02-19
  guser_type: eleve
--*/

/*--
  response : 
<form id="form-modalForm" class="" method="POST" >
<div class="row ">
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
<div class="row ">
<div class="reveal-modal-date col-lg-2 col-lg-offset-3 col-md-3 r-col-md-offset-15 col-sm-3 r-col-sm-offset-15 col-xs-4 col-xs-offset-0">
<div class="reveal-modal-date-ico"><i class="fa fa-2x fa-calendar"></i></div><div class="reveal-modal-date-display"><span class="reveal-modal-date-sday">SAMEDI</span><span class="reveal-modal-date-date">19/02/22</span></div></div>
<div class="reveal-modal-hour col-lg-2 col-md-3 col-sm-3 col-xs-4">
<div class="reveal-modal-hour-ico"><i class="fa fa-2x fa-clock-o"></i></div><div class="reveal-modal-hour-display">14h00</div></div>
<div class="reveal-modal-pro col-lg-2 col-md-3 col-sm-3 col-xs-4">
<div class="reveal-modal-pro-ico"><i class="fa fa-2x fa-user"></i></div><div class="reveal-modal-pro-display">Charles R</div></div>
</div>
<div class="row ">
<div class="reveal-modal-block col-lg-3 col-md-5 col-lg-offset-3 col-md-offset-2 col-sm-7 col-sm-offset-0 col-xs-12 col-xs-offset-0">
<div class="reveal-modal-block-title col-lg-12 col-md-12 col-sm-12 col-xs-3">
<div class="reveal-modal-block-title-ico"><i class="fa fa-2x fa-cubes"></i></div><div class="reveal-modal-block-title-display">Cours</div></div>
<div class="reveal-modal-block-form col-lg-12 col-md-12 col-sm-12 col-xs-9">
<div class="reveal-modal-ok"><i class="fa fa-check"></i>SWING 4U BRONZE</div></div>
</div>
<div class="reveal-modal-block col-md-3 col-lg-3 col-md-offset-0 col-sm-5 col-xs-12">
<div class="reveal-modal-block-title col-lg-12 col-md-12 col-sm-12 col-xs-3">
<div class="reveal-modal-block-title-ico"><i class="fa fa-2x fa-hourglass-1"></i></div><div class="reveal-modal-block-title-display">Durée</div></div>
<div class="reveal-modal-block-form col-lg-12 col-md-12 col-sm-12 col-xs-9" id="modal_block_duree">
<div class="reveal-modal-ok"><i class="fa fa-check"></i>1h00min</div></div>
</div>
<div class="reveal-modal-block col-lg-3 col-lg-offset-2 col-md-offset-1 col-md-4  col-sm-5 col-sm-offset-0 col-xs-12 col-xs-offset-0">
<div class="reveal-modal-block-title col-lg-12 col-md-12 col-sm-12 col-xs-3">
<div class="reveal-modal-block-title-ico"><i class="fa fa-2x fa-star"></i></div><div class="reveal-modal-block-title-display">Niveaux</div></div>
<div class="reveal-modal-block-form col-lg-12 col-md-12 col-sm-12 col-xs-9" id="modal_block_niveau">
<div class="reveal-modal-ok"><i class="fa fa-check"></i><div class="r-level-name" data-action="hover" data-target="#niv-1043062" title="Liste des niveaux" >Niveaux multiples</div><div class="r-level-block" style="background:#99631d;" id="niv-1043062"><div class="r-level-block-close" onclick="$('#niv-1043062').hide();">X</div>- ARGENT<br/>- BRONZE<br/>- Go for Golf<br/>- INITIATION<br/>- Smartbox<br/></div></div></div>
</div>
<div class="reveal-modal-block col-lg-5 col-md-6 col-sm-7 col-xs-12">
<div class="reveal-modal-block-title col-lg-12 col-md-12 col-sm-12 col-xs-3">
<div class="reveal-modal-block-title-ico"><i class="fa fa-2x fa-database"></i></div><div class="reveal-modal-block-title-display">Crédits</div></div>
<div class="reveal-modal-block-form col-lg-7 col-md-6 col-sm-6 col-xs-9" id="modal_block_prix">
<div class="reveal-modal-ok">Inclus dans votre formule</div></div>
<div class="reveal-modal-block-err reveal-modal-block-price col-lg-5 col-lg-offset-0 col-md-6 col-md-offset-0 col-sm-6 col-sm-offset-0 col-xs-9 col-xs-offset-3 ">
<div class="reveal-modal-ok">Swing 4U</div></div>
</div>
</div>
<div class="row ">
<div class="reveal-modal-button col-lg-12 col-md-12 col-sm-12 col-xs-12">
<button type="button" id="modal_eleve_add" name="modal_eleve_add" value="1" class="btn btn-reveal reveal-modal-submit auto-close-reveal-modal btn-md" ><i class="fa fa-close"></i>&nbsp;&nbsp;S'INSCRIRE</button>
</div>
</div>
<div class="row ">
<div class="reveal-modal-block col-lg-12 col-md-12 col-sm-12 col-xs-12">
</div></div>
</div>
</div>
</div>
_TITLE_Informations du cours
--*/

/*--
Request URL: https://academiegolf.com/includes/public/ajaxCtrl/_ajaxPlanning.php?action=eleveAddEvtPublish
Request Method: POST

Query string :
  action: eleveAddEvtPublish
Form data :
  (empty)
  lang: fr
  golf_evt_id: 1043062
  guser_id: rame-011008
  golf_id: 24
  datePlus: 2022-02-19
  guser_type: eleve
  defineTheme: empty
*/
