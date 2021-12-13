import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CourseModule } from './courses/courses.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CourseModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR'}],
  bootstrap: [AppComponent],
})
export class AppModule {}
