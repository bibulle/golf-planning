import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { CalendarService } from '../calendar/calendar.service';
import { AuthenticationService, Provider } from './authentication.service';

class RealGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  readonly logger = new Logger(RealGoogleStrategy.name);

  private static readonly SCOPES = ['profile', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly'];

  constructor(private readonly calendarService: CalendarService, private readonly authenticationService: AuthenticationService, _clientID: string, clientSecret: string, callbackURL: string) {
    //noinspection JSUnusedGlobalSymbols
    super({
      clientID: _clientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
      passReqToCallback: true,
      scope: RealGoogleStrategy.SCOPES
    });
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile, done: any) {
    try {
      // this.logger.debug(refreshToken);
      // this.logger.debug(profile.displayName);

      this.calendarService.addUserTokens(profile.displayName, { accessToken: accessToken, refreshToken: refreshToken });

      // if (refreshToken) {
      //   this.logger.warn(`refresh token found for ${profile.displayName}`);
      // }
      const jwt: string = await this.authenticationService.validateOAuthLogin(profile, Provider.GOOGLE);
      const user = {
        jwt
      };
      done(null, user);
    } catch (err) {
      this.logger.error('Status : ' + err.status + ' (' + err.message.message + ')');
      this.logger.error(err);
      done(err, false);
    }
  }
}

@Injectable()
export class GoogleStrategy {
  constructor(private readonly calendarService: CalendarService, private readonly authenticationService: AuthenticationService, private readonly _configService: ConfigService) {
    this.strategy = new RealGoogleStrategy(
      this.calendarService,
      this.authenticationService,
      this._configService.get('AUTHENT_GOOGLE_CLIENT_ID'),
      this._configService.get('AUTHENT_GOOGLE_CLIENT_SECRET'),
      this._configService.get('AUTHENT_GOOGLE_CALLBACK_URL')
    );
  }

  strategy: RealGoogleStrategy;
}
