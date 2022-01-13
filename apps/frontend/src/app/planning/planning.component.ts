import { Component, OnInit } from '@angular/core';
import { Course } from '@golf-planning/api-interfaces';
import { PlanningService } from './planning.service';

@Component({
  selector: 'golf-planning-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  planning: Course[] = [];

  constructor(private _planningService: PlanningService) {}

  ngOnInit(): void {
    this._planningService.getPlanning().subscribe((planning) => {
      //console.log(planning);
      this.planning = planning;
    });
  }

}
