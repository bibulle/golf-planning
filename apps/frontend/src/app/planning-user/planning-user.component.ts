import { Component, OnInit } from '@angular/core';
import { Course } from '@golf-planning/api-interfaces';
import { PlanningUserService } from './planning-user.service';

@Component({
  selector: 'golf-planning-cours',
  templateUrl: './planning-user.component.html',
  styleUrls: ['./planning-user.component.scss']
})
export class PlanningUserComponent implements OnInit {
  planning: Course[] = [];

  constructor(private _planningService: PlanningUserService) {}

  ngOnInit(): void {
    this._planningService.getPlanning().subscribe((planning) => {
      //console.log(planning);
      this.planning = planning;
    });
  }
}
