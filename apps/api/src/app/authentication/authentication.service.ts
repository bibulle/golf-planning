import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { User } from '@golf-planning/api-interfaces';
import { UsersService } from '../users/users.service';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthenticationService {
  readonly logger = new Logger(AuthenticationService.name);

  constructor(private readonly _configService: ConfigService, private readonly _userService: UsersService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validateOAuthLogin(thirdPartyUser: any, provider: Provider): Promise<string> {
    this.logger.debug('validateOAuthLogin "' + thirdPartyUser.displayName + '"');
    //this.logger.debug(thirdPartyUser);

    if (this._configService.get('USERS_AUTHORIZED', '').split('|').indexOf(thirdPartyUser.displayName) < 0) {
      throw new UnauthorizedException('Your are not authorized to use this application (' + thirdPartyUser.displayName + ').');
    }

    try {
      //sign(this.logger.debug(thirdPartyUser._json);
      const user: User = this._userService.setGoogleToUser(
        thirdPartyUser.displayName,
        thirdPartyUser._json.given_name,
        thirdPartyUser._json.family_name,
        thirdPartyUser._json.locale,
        thirdPartyUser._json.name,
        thirdPartyUser._json.picture,
        provider,
        thirdPartyUser._json.sub
      );

      const user1 = { ...user };
      delete user1.academiegolf_login;
      delete user1.academiegolf_password;
      return sign(user1, this._configService.get('AUTHENT_JWT_SECRET'), { expiresIn: 3600 });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }
}
