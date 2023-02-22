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

  constructor(@Optional() public dialogRef: MatDialogRef<RegisterCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { course: Course; users: User[] }) {}

  ngOnInit(): void {
    this.courseDate = Course.getFullDate(this.data.course);
    this.data.course.users.forEach((u) => {
      if (u.academiegolf_index) this.selectedUser[u.academiegolf_index] = true;
    });
  }


  getRegisterError(): void | string {
    let countNewSelectedUser = 0;
    this.selectedUser.forEach((b, index) => {
      const ul = this.data.course.users.filter((u) => {
        return u.academiegolf_index === index;
      });
      if (b && ul.length === 0) {
        countNewSelectedUser++;
      }
    });

    if (countNewSelectedUser === 0) {
      return 'Personne à inscrire';
    }
    if (countNewSelectedUser > this.data.course.places) {
      return 'Trop de selection pour le nombre de place';
    }
    return;
  }

  getDeregisterError(): void | string {
    let countNewDeselectedUser = 0;
    this.selectedUser.forEach((b, index) => {
      const ul = this.data.course.users.filter((u) => {
        return u.academiegolf_index === index;
      });
      if (!b && ul.length !== 0) {
        countNewDeselectedUser++;
      }
    });
    if (countNewDeselectedUser === 0) {
      return 'Personne à désinscrire';
    }
    return;
  }

  getError(): void | string {
    if (!this.data.course.golf_evt_id || !this.data.course.golf_id) {
      return "Quelque chose a merdé, pas d'Id de cours";
    }
    return;
  }

  isUserAlreadyRegistered(index: number): boolean {
    return this.data.course.users.some((u) => {
      return u.academiegolf_index === index;
    });
  }
  countSelectedUsers(): number {
    return this.selectedUser.filter((v) => v).length;
  }

  onSubmit(id: string) {
    if (id === 'deregister') {
      this.deregister();
    } else {
      this.register();
    }
  }

  register() {
    this.dialogRef.close({register: this.selectedUser.map((b, i) => (b ? i : null)).filter((b) => b).filter(i => i && !this.isUserAlreadyRegistered(i))});
  }

  deregister() {
    this.dialogRef.close({deregister: this.selectedUser.map((b, i) => (!b ? i : null)).filter((b) => b)});
  }

  cancel() {
    this.dialogRef.close();
  }
}
