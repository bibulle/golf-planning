import { User } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Provider } from '../authentication/authentication.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  users: { [id: string]: User } = {};

  constructor(private configService: ConfigService) {}

  /**
   * Read users from environment
   * @returns
   */
  readFromEnv(): User[] {
    const users: User[] = [];

    let cpt = 0;
    do {
      cpt++;
      const given_name = this.configService.get(`GOLF_USER_${cpt}`);
      const login = this.configService.get(`GOLF_LOGIN_${cpt}`);
      const password = this.configService.get(`GOLF_PASSWORD_${cpt}`);
      const loginChrono = this.configService.get(`CHRONOGOLF_LOGIN_${cpt}`);
      const passwordChrono = this.configService.get(`CHRONOGOLF_PASSWORD_${cpt}`);
      if (given_name && login && password) {
        users.push(this.setGolfSiteToUser(given_name, cpt, login, password, loginChrono, passwordChrono));
        //debug(cpt, login);
      }
    } while (users[cpt - 1]);

    if (!users[0]) {
      this.logger.error('At least user 1 should be defined');
      //process.exit(-1);
    }

    return users;
  }

  getUser(displayName: string) {
    if (!this.users[displayName]) {
      this.users[displayName] = new User(displayName);
    }
    return this.users[displayName];
  }

  setGolfSiteToUser(displayName: string, index: number, login: string, password: string, loginChrono: string, passwordChrono: string): User {
    this.getUser(displayName).academiegolf_index = index;
    this.getUser(displayName).academiegolf_login = login;
    this.getUser(displayName).academiegolf_password = password;
    this.getUser(displayName).chronogolf_login = loginChrono;
    this.getUser(displayName).chronogolf_password = passwordChrono;

    return this.getUser(displayName);
  }
  setGoogletoUser(displayName: string, given_name: string, family_name: string, locale: string, name: string, picture: string, provider: Provider, providerId: string): User {
    this.logger.debug(`setGoogletoUser : '${displayName}'`);
    this.getUser(displayName).displayName = displayName;
    this.getUser(displayName).family_name = family_name;
    this.getUser(displayName).given_name = given_name;
    this.getUser(displayName).locale = locale;
    this.getUser(displayName).name = name;
    this.getUser(displayName).picture = picture;
    this.getUser(displayName).provider = provider;
    this.getUser(displayName).providerId = providerId;

    return this.getUser(displayName);
  }
}
