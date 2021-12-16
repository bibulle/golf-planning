import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
  ],
  declarations: [
    NavbarComponent
  ],
  exports: [
      NavbarComponent
  ]
})
export class NavbarModule {}
