import { User } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService} from '@nestjs/config';


@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);


    constructor(private configService: ConfigService) {

    }

  /**
   * Read users from environment
   * @returns 
   */
  readFromEnv(): User[] {
    const users: User[] = [];
  
    let cpt = 0;
    do {
      cpt++;
      const login = this.configService.get(`GOLF_LOGIN_${cpt}`);
      const password = this.configService.get(`GOLF_PASSWORD_${cpt}`);
      if (login && password) {
        users.push(new User(login, password));
        //debug(cpt, login);
      }
    } while (users[cpt - 1]);
  
    if (!users[0]) {
        this.logger.error("At least user 1 should be defined");
      //process.exit(-1);
    }
  
    return users;
  }  
}
