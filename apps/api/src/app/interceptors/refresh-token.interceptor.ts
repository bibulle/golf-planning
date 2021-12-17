import { User } from '@golf-planning/api-interfaces';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthenticationService, Provider } from '../authentication/authentication.service';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  readonly logger = new Logger(RefreshTokenInterceptor.name);

  constructor(private readonly _authenticationService: AuthenticationService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // this.logger.debug("intercept");

    let minutesBeforeExpiration: number;
    if (request.user && request.user.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(request.user.exp);
      minutesBeforeExpiration = (expirationDate.valueOf() - new Date().valueOf()) / (60 * 1000);

      //this.logger.debug(`Expiration in ${minutesBeforeExpiration.toFixed()} min (${expirationDate.toLocaleTimeString()})`);
    }

    if (minutesBeforeExpiration && minutesBeforeExpiration < 10) {
      const user = request.user as User;
      const thirdPartyUser = {
        displayName: user.name,
        _json: {
          family_name: user.family_name,
          given_name: user.given_name,
          locale: user.locale,
          name: user.name,
          picture: user.picture,
          sub: user.providerId
        }
      };

      return next.handle().pipe(
        map(async data => {
          //console.log(data);
          if (!data) {
            data = {};
          }
          if (!data.data) {
            data = { data: data };
          }

          // add refresh if needed
          data.refreshToken = await this._authenticationService
            .validateOAuthLogin(thirdPartyUser, Provider.GOOGLE)
            .catch(reason => {
              this.logger.error(`${reason.message.message}`);
            });

          //this.logger.debug(data);

          return data;
        })
      );
    } else {
      return next.handle().pipe(
        map(async data => {
          if (!data) {
            data = {};
          }
          if (!data.data) {
            data = { data: data };
          }
          // this.logger.debug(data);

          return data;
        })
      );
    }
  }
}
