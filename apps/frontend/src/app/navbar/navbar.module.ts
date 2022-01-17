import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FilterModule } from '../filter/filter.module';
import { UserModule } from '../user/user.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [
    BrowserModule,
    MatMenuModule, 
    RouterModule,
    UserModule,
    FilterModule
  ],
  declarations: [
    NavbarComponent
  ],
  exports: [
      NavbarComponent
  ]
})
export class NavbarModule {}
