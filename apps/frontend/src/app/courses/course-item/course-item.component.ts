import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Course, User } from '@golf-planning/api-interfaces';
import { PlanningUserService } from '../../planning-user/planning-user.service';
import { RegisterCourseDialogComponent } from '../register-course-dialog/register-course-dialog.component';

@Component({
  selector: 'golf-planning-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss'],
})
export class CourseItemComponent implements OnChanges {
  @Input() course!: Course;

  @Input() users: User[] = [];

  isInThePast = true;

  constructor(private _dialog: MatDialog, private _planningUserService: PlanningUserService) {}

  ngOnChanges(): void {
    // console.log('OnChange');
    this.isInThePast = Course.getFullDate(this.course).getTime() < new Date().getTime();
  }

  isUser(index: number): boolean {
    return this.course.users.some((u) => {
      return u.academiergolf_index === index;
    });
  }

  openDialog() {
    const dialogRef = this._dialog.open(RegisterCourseDialogComponent, { data: { course: this.course, users: this.users } });

    dialogRef.afterClosed().subscribe((selectedusers: number[]) => {
 
      if (!selectedusers || selectedusers.length === 0) {
        console.log('Nothing to do');
        return;
      }

      selectedusers.map(id => {
        return this.users.find(u => u.academiergolf_index === id);
      }).forEach( u => {
        if (u) {
          this._planningUserService.registerUser(this.course, u)
        }
      });
    });
  }
}
