import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, RouterModule, MatMenuModule],
  exports: [UserComponent],
})
export class UserModule {}
