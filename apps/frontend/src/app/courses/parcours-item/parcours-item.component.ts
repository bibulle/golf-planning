import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ParcoursResa, User } from '@golf-planning/api-interfaces';
import { PlanningUserService } from '../../planning-user/planning-user.service';

@Component({
  selector: 'golf-planning-parcours-item',
  templateUrl: './parcours-item.component.html',
  styleUrls: ['./parcours-item.component.scss'],
})
export class ParcoursItemComponent implements OnChanges {
  @Input() parcours!: ParcoursResa;

  @Input() users: User[] = [];

  isInThePast = true;

  constructor(private _dialog: MatDialog, private _planningUserService: PlanningUserService) {}

  ngOnChanges(): void {
    // console.log('OnChange');
    this.isInThePast = this.parcours.teetime.getTime() < new Date().getTime();
  }

  isUser(index: number): boolean {
    return this.parcours.users.some((u) => {
      return u.academiergolf_index === index;
    });
  }

}
