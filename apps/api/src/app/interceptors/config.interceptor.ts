import { ApiReturn, Version } from '@golf-planning/api-interfaces';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ConfigInterceptor implements NestInterceptor {
  readonly logger = new Logger(ConfigInterceptor.name);
  readonly version = new Version();

  constructor(private readonly _configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        // in case of stream
        if (data && data.stream) {
          return data;
        }

        if (!data) {
          data = {};
        }
        if (!data.data) {
          data = { data: data };
        }

        const ret = data as ApiReturn;
        // add config
        ret.config = {
          backendVersion: this.version.version,
          vapidPublicKey: this._configService.get('VAPID_PUBLIC_KEY'),
        };

        //this.logger.debug(data);

        return data;
      })
    );
  }
}
