import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { UserModule } from '../user/user.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    UserModule
  ],
  declarations: [
    NavbarComponent
  ],
  exports: [
      NavbarComponent
  ]
})
export class NavbarModule {}
