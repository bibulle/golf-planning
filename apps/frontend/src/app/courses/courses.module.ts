import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseItemComponent } from './course-item/course-item.component';



@NgModule({
  declarations: [
    CourseItemComponent,
    CourseListComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CourseItemComponent,
    CourseListComponent,
  ]
})
export class CoursesModule { }
