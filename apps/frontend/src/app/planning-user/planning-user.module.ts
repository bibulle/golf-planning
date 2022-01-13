import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningUserComponent } from './planning-user.component';
import { CoursesModule } from '../courses/courses.module';



@NgModule({
  imports: [CommonModule, CoursesModule],
  declarations: [
    PlanningUserComponent
  ],
  exports: [
    PlanningUserComponent
  ]
})
export class PlanningUserModule { }
