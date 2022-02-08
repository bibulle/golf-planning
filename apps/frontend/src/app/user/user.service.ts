/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Config, Filter, MyToken, User } from '@golf-planning/api-interfaces';
import { BehaviorSubject, distinctUntilChanged, Observable, timer } from 'rxjs';
import { WindowService } from '../utils/window/window.service';
import { ApiReturn } from '@golf-planning/api-interfaces';

enum LoginProvider {
  GOOGLE,
}

@Injectable({
  providedIn: 'root',
})
export class JwtHelperServiceService {
  private jwtHelper: JwtHelperService = new JwtHelperService();

  getJwtHelper(): JwtHelperService {
    return this.jwtHelper;
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private static readonly KEY_TOKEN_LOCAL_STORAGE = 'id_token';

  private static readonly KEY_CONFIG_LOCAL_STORAGE: string = 'config';

  private userSubject: BehaviorSubject<User>;
  private user = {} as User;

  private config: Config;
  private readonly configSubject: BehaviorSubject<Config>;

  private loopCount = 600;
  private intervalLength = 100;

  private windowHandle: any = null;
  private intervalId: any = null;

  timer1;

  constructor(private readonly _http: HttpClient, private readonly _jwtHelperServiceService: JwtHelperServiceService) 
  // TODO: Work on notification service
  // private readonly _notificationService: NotificationService,
  // private readonly logger: NGXLogger,
  {
    this.userSubject = new BehaviorSubject<User>(this.user);

    this.checkAuthentication();

    this.timer1 = timer(3 * 1000, 3 * 1000);
    this.timer1.subscribe(() => {
      this.checkAuthentication();
    });

    try {
      this.config = new Config();
      const l = localStorage.getItem(UserService.KEY_CONFIG_LOCAL_STORAGE);
      if (l) {
        const newConfig: Config = JSON.parse(l);
        const table:{[id:string]: Filter } = newConfig.filters.reduce((a,f) => ({...a, [f.id]: f}), {}) ;
        this.config.filters.forEach(f => {
          if (table[f.id]) {
              f.selected = table[f.id].selected;
          } 
        });
      }
    } catch {
      this.config = new Config();
    }
    this.configSubject = new BehaviorSubject<Config>(this.config);

  }

  /**
   * Get token from local storage
   * @returns {string | null}
   */
  static tokenGetter() {
    return localStorage.getItem(UserService.KEY_TOKEN_LOCAL_STORAGE);
  }

  /**
   * Set token to local storage
   * @param {string} token
   */
  static tokenSetter(token: string) {
    localStorage.setItem(UserService.KEY_TOKEN_LOCAL_STORAGE, token);
  }

  /**
   * Remove token from local storage
   */
  public static tokenRemove() {
    localStorage.removeItem(UserService.KEY_TOKEN_LOCAL_STORAGE);
  }

  /**
   * Get the observable on user changes
   * @returns {Observable<User>}
   */
  userObservable(): Observable<User> {
    return this.userSubject.pipe(
      // .debounceTime(200)
      distinctUntilChanged((a, b) => {
        // this.logger.debug(JSON.stringify(a));
        // this.logger.debug(JSON.stringify(b));
        return JSON.stringify(a) === JSON.stringify(b);
      })
    );
  }

  /**
   * Check authentication locally (is the jwt not expired)
   * @param emitEvent if false, do this silently
   * @returns {boolean} are we authenticate
   */
  checkAuthentication(emitEvent = true): boolean {
    //console.log('checkAuthentication');
    let ret = false;

    const jwt = UserService.tokenGetter();

    // this.logger.debug(jwt);
    //    const oldUser = this.user;

    if (!jwt || this._jwtHelperServiceService.getJwtHelper().isTokenExpired(jwt)) {
      // this.logger.debug(jwt);
      // this.logger.debug('', this._jwtHelperServiceService.getJwtHelper().isTokenExpired(jwt));
      this.user = {} as User;
    } else {
      this.user = this._jwtHelperServiceService.getJwtHelper().decodeToken(jwt) as User;

      // const expirationDate = new Date(0);
      // expirationDate.setUTCSeconds(this.user['exp']);
      // const minutesBeforeExpiration = (expirationDate.valueOf() - new Date().valueOf()) / (60 * 1000);
      // this.logger.debug(`Expiration in ${minutesBeforeExpiration.toFixed()} min (${expirationDate.toLocaleTimeString()})`);

      ret = true;
    }

    // console.log('', this.user);

    if (emitEvent) {
      this.userSubject.next(this.user);
    }

    return ret;
  }

  /**
   * Is logged ?
   */
  isAuthenticate(): boolean {
    // this.logger.debug('isAuthenticate');

    this.checkAuthentication();

    return !!(this.user && this.user.providerId);
  }

  // isAdminAuthenticate() {
  //   return this.isAuthenticate() && this.user.isAdmin === true;
  // }

  /**
   * Logout (just remove the JWT token)
   */
  logout() {
    UserService.tokenRemove();
    this.checkAuthentication();
  }

  /**
   * Start logging process with google
   */
  startLoginGoogle() {
    // this.logger.debug('startLoginGoogle');
    const oAuthURL = `/api/authentication/google`;
    return this._startLoginOAuth(oAuthURL, LoginProvider.GOOGLE);
  }

  /**
   * Login with google codes (and get a JWT token)
   * @param parsed
   * @returns {Promise<void>}
   */
  loginGoogle(parsed: any): Promise<User | string> {
    // this.logger.debug('loginGoogle ' + parsed);
    return this._doGet('/api/authentication/google/callback?code=' + parsed.code);
  }

  /**
   * Start logging process
   * @param oAuthURL
   * @param loginProvider
   * @returns {Promise<void>}
   * @private
   */
  private _startLoginOAuth(oAuthURL: string, loginProvider: LoginProvider) {
    console.log('_startLoginOAuth ' + oAuthURL);
    const oAuthCallbackUrl = '/assets/logged.html';

    return new Promise<void>((resolve, reject) => {
      let loopCount = this.loopCount;
      this.windowHandle = WindowService.createWindow(oAuthURL, 'OAuth2 Login');

      this.intervalId = setInterval(() => {
        let parsed;
        // this.logger.debug('interval : ' + loopCount);
        if (loopCount-- < 0) {
          // Too many try... stop it
          clearInterval(this.intervalId);
          this.windowHandle.close();
          this.checkAuthentication();
          console.error('Time out : close logging window');
          reject('Time out');
        } else {
          // Read th URL in the window
          let href: string | null = null;
          try {
            // this.logger.debug(this.windowHandle.location.href);
            href = this.windowHandle.location.href;
          } catch (e) {
            console.error('Error:', e);
          }

          // this.logger.debug(href);

          if (href != null) {
            // We got an answer...
            // this.logger.debug(href);

            // try to find the code
            const reSimple = /[?&](code|access_token)=(.*)/;
            const foundSimple = href.match(reSimple);

            // this.logger.debug(href + ' ' + foundSimple + ' ' + href.indexOf(oAuthCallbackUrl));

            if (foundSimple) {
              clearInterval(this.intervalId);
              this.windowHandle.close();

              parsed = this._parseQueryString(href.replace(new RegExp(`^.*${oAuthCallbackUrl}[?]`), ''));
              // this.logger.debug(parsed);

              if (parsed.code) {
                // we got the code... login
                if (loginProvider === LoginProvider.GOOGLE) {
                  this.loginGoogle(parsed)
                    .then(() => {
                      resolve();
                    })
                    .catch((msg) => {
                      this.checkAuthentication();
                      reject(msg);
                    });
                }
              } else {
                console.error('oAuth callback without and with code...?.. ' + href);
                this.checkAuthentication();
                reject('login error');
              }
            } else {
              // http://localhost:3000/auth/callback#error=access_denied
              if (href.indexOf(oAuthCallbackUrl) >= 0) {
                // If error
                clearInterval(this.intervalId);
                this.windowHandle.close();
                this.checkAuthentication();

                parsed = this._parseQueryString(href.replace(new RegExp(`^.*${oAuthCallbackUrl}[?]`), ''));

                if (parsed.error_message) {
                  reject(parsed.error_message.replace(/[+]/g, ' '));
                } else {
                  reject('Login error');
                }
              }
            }
          }
        }
      }, this.intervalLength);
    });
  }

  /**
   * Perform the login (get after external popup)
   * @param authentUrl
   * @returns {Promise<void>}
   * @private
   */
  private _doGet(authentUrl: string) {
    // this.logger.debug('_doGet '+authentUrl);

    return new Promise<User | string>((resolve, reject) => {
      this._http
        .get<ApiReturn | undefined>(authentUrl, {
          headers: new HttpHeaders({
            Accept: 'application/json',
          }),
        })
        // .timeout(3000)
        .toPromise()
        .then((data: ApiReturn | undefined) => {
          if (!data) {
            console.error('Weird data ...');
            return reject('login error');
          }
          // console.log('-----------');
          // console.log(data);
          const value = data.data as MyToken;
          // console.log(value);
          if (value && value.id_token) {
            UserService.tokenSetter(value.id_token);
            this.checkAuthentication();
            resolve('');
          } else {
            resolve('');
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((error) => {
          this.checkAuthentication();

          // this._notificationService.handleError(error);
          reject('login error');
        });
    });
  }

  /**
   * Parse a query string (lifted from https://github.com/sindresorhus/query-string)
   * @param str
   * @returns {{}}
   */
  private _parseQueryString(str: string) {
    // log("_parseQueryString : "+str);
    if (typeof str !== 'string') {
      return {};
    }

    str = str.trim().replace(/^[?#&]/, '');

    if (!str) {
      return {};
    }

    //noinspection TypeScriptValidateJSTypes
    return str.split('&').reduce(function (ret: { [id: string]: any }, param) {
      //noinspection TypeScriptValidateJSTypes
      const parts = param.replace(/[+]/g, ' ').split('=');
      // Firefox (pre 40) decodes `%3D` to `=`
      // https://github.com/sindresorhus/query-string/pull/37
      let key: string | undefined = parts.shift();
      let val = parts.length > 0 ? parts.join('=') : undefined;
      if (key) {
        key = decodeURIComponent(key);
      }

      // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
      if (val) {
        val = decodeURIComponent(val);
      }

      if (key) {
        if (!ret[key]) {
          ret[key] = val == undefined ? null : val;
        } else if (Array.isArray(ret[key])) {
          ret[key].push(val == undefined ? null : val);
        } else {
          ret[key] = [ret[key], val == undefined ? null : val];
        }
      }

      return ret;
    }, {});
  }

  // Configuration management
  configObservable(): Observable<Config> {
    return this.configSubject;
  }

  updateConfig(config: Config) {
    this.config = config;
    localStorage.setItem(UserService.KEY_CONFIG_LOCAL_STORAGE, JSON.stringify(this.config));
    this.configSubject.next(this.config);
  }


  // changeLanguage(language: string) {
  //   // this.setSearch('');
  //   this.config.language = language;

  //   // console.log(this.config.language);
  //   this._translateService.use(this.config.language);

  //   localStorage.setItem(UserService.KEY_CONFIG_LOCAL_STORAGE, JSON.stringify(this.config));

  //   this.configSubject.next(this.config);
  // }
}
