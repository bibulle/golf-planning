import { Component, OnInit } from '@angular/core';
import { Course, User } from '@golf-planning/api-interfaces';
import { PlanningUserService } from '../planning-user/planning-user.service';
import { PlanningService } from './planning.service';

@Component({
  selector: 'golf-planning-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  planning: Course[] = [];
  users: User[] = [];

  constructor(private _planningService: PlanningService, private _planningUserService: PlanningUserService) {}

  ngOnInit(): void {
    this._planningService.getPlanning().subscribe((planning) => {
      //console.log(planning);
      this.planning = planning;
    });
    this._planningUserService.getUsers().subscribe((users) => {
      //console.log(users);
      this.users = users;
    });

  }

}
