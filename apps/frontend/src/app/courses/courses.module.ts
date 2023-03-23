import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { CourseItemComponent } from './course-item/course-item.component';
import { CourseListComponent } from './course-list/course-list.component';
import { RegisterCourseDialogComponent } from './register-course-dialog/register-course-dialog.component';
import { FormsModule } from '@angular/forms';
import { ParcoursItemComponent } from './parcours-item/parcours-item.component';

@NgModule({
  declarations: [CourseItemComponent, ParcoursItemComponent, CourseListComponent, RegisterCourseDialogComponent],
  imports: [CommonModule, MatDialogModule, MatCardModule, FormsModule],
  exports: [CourseItemComponent, ParcoursItemComponent, CourseListComponent],
})
export class CoursesModule {}
