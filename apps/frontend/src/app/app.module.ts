import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard, AuthGuardAdmin } from './authent/authent.guard';
import { FilterModule } from './filter/filter.module';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { MaterialModule } from './material.module';
import { NavbarModule } from './navbar/navbar.module';
import { UserService } from './user/user.service';

registerLocaleData(localeFr);


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
    FilterModule,
    MaterialModule,
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
