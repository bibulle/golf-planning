import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseComponent } from './course/course.component';



@NgModule({
  declarations: [
    CourseListComponent,
    CourseComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CourseListComponent,
    CourseComponent
  ]
})
export class CourseModule { }
