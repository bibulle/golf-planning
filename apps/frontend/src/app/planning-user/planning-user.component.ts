import { Component, OnInit } from '@angular/core';
import { Course, User } from '@golf-planning/api-interfaces';
import { PlanningUserService } from './planning-user.service';

@Component({
  selector: 'golf-planning-cours',
  templateUrl: './planning-user.component.html',
  styleUrls: ['./planning-user.component.scss']
})
export class PlanningUserComponent implements OnInit {
  planning: Course[] = [];
  users: User[] = [];

  constructor(private _planningService: PlanningUserService) {}

  ngOnInit(): void {
    this._planningService.getPlanning().subscribe((planning) => {
      //console.log(planning);
      this.planning = planning;
    });
    this._planningService.getUsers().subscribe((users) => {
      //console.log(users);
      this.users = users;
    });
  }
}
