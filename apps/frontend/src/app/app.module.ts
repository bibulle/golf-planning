import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NavbarModule } from './navbar/navbar.module';
import { AuthGuard, AuthGuardAdmin } from './authent/authent.guard';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { VersionInterceptor } from './interceptors/version.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { UserService } from './user/user.service';
import { FilterModule } from './filter/filter.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: UserService.tokenGetter,
        allowedDomains: [
          ('localhost:4002' as string | 'localhost:4002') as string | RegExp,
          'golf.bibulle.fr',
          new RegExp('^null$'),
        ],
      },
    }),
    NavbarModule,
    FilterModule
  ],
  providers: [
    AuthGuard,
    AuthGuardAdmin,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true,
    },
    // { provide: HTTP_INTERCEPTORS, useClass: VersionInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
