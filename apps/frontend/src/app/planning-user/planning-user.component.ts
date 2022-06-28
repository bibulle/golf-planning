import { Component, OnInit } from '@angular/core';
import { Course, ParcoursResa, User } from '@golf-planning/api-interfaces';
import { PlanningUserService } from './planning-user.service';

@Component({
  selector: 'golf-planning-cours',
  templateUrl: './planning-user.component.html',
  styleUrls: ['./planning-user.component.scss']
})
export class PlanningUserComponent implements OnInit {
  planning: (Course|ParcoursResa)[] = [];
  courses: Course[] = [];
  parcours: ParcoursResa[] = [];
  users: User[] = [];

  constructor(private _planningService: PlanningUserService) {}

  ngOnInit(): void {
    this._planningService.getPlanning().subscribe((courses) => {
      // console.log(courses);
      this.courses = courses;

      this.mergeLists();
    });
    this._planningService.getParcoursResa().subscribe((parcours) => {
      // console.log(parcours);
      this.parcours = parcours;

      this.mergeLists();
    });
    this._planningService.getUsers().subscribe((users) => {
      //console.log(users);
      this.users = users;
    });
  }
  mergeLists() {

    this.planning = [];
    this.planning = this.planning.concat(this.courses);
    this.planning = this.planning.concat(this.parcours);
    // console.log(this.planning);

  }
}
