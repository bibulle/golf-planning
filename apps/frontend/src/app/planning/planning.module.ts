import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoursesModule } from '../courses/courses.module';
import { PlanningComponent } from './planning.component';

@NgModule({
  imports: [CommonModule, CoursesModule],
  declarations: [PlanningComponent],
  exports: [PlanningComponent],
})
export class PlanningModule {}
