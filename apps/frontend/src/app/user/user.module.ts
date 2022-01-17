import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';



@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule
  ],
  exports: [
    UserComponent
  ],

})
export class UserModule { }
