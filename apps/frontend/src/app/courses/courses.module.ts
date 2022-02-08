import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CourseItemComponent } from './course-item/course-item.component';
import { CourseListComponent } from './course-list/course-list.component';
import { RegisterCourseDialogComponent } from './register-course-dialog/register-course-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CourseItemComponent, CourseListComponent, RegisterCourseDialogComponent],
  imports: [CommonModule, MatDialogModule, MatCardModule, FormsModule],
  exports: [CourseItemComponent, CourseListComponent],
})
export class CoursesModule {}
