import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ConfigService } from './config.service';
import { ApiReturn } from '@golf-planning/api-interfaces';

@Injectable()
export class ConfigInterceptor implements HttpInterceptor {
  constructor(private _configService: ConfigService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // console.log('VersionInterceptor intercept');

    return next.handle(request).pipe(
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          const data = event.body as ApiReturn;
          if (data && data.config) {
            // console.log(data.config);
            this._configService.setConfig(data.config);
            // this._versionService.checkVersion();
          }
        }
      })
    );
  }
}
