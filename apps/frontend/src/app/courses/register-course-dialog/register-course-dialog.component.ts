import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Course, User } from '@golf-planning/api-interfaces';

@Component({
  selector: 'golf-planning-register-course-dialog',
  templateUrl: './register-course-dialog.component.html',
  styleUrls: ['./register-course-dialog.component.scss'],
})
export class RegisterCourseDialogComponent implements OnInit {

  courseDate: null | Date = null;

  selectedUser: boolean[] = []; 

  constructor(
    @Optional() public dialogRef: MatDialogRef<RegisterCourseDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { course: Course; users: User[] }) {}

  ngOnInit(): void {
    this.courseDate = Course.getFullDate(this.data.course);    
  }

  getError(): void | string {
    if (!this.data.course.golf_evt_id || !this.data.course.golf_id) {
      return "Quelque chose a merdé, pas d'Id de cours";
    }
    if (this.countSelectedUsers() === 0) {
      return "Personne à inscrire";
    }
    if (this.countSelectedUsers() > this.data.course.places) {
      return "Trop de selection pour le nombre de place";
    }
    return
  }

  isUserAlreadyRegistered(index: number): boolean {
    return this.data.course.users.some((u) => {
      return u.academiergolf_index === index;
    });
  }
  countSelectedUsers(): number {
    return this.selectedUser.filter(v => v).length
  }

  register() {
    this.dialogRef.close(this.selectedUser.map((b, i) => (b ? i : null)).filter((b) => b));
  }

  cancel() {
    this.dialogRef.close();
  }
}
