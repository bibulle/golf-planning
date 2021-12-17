import { Component, Input, OnInit } from '@angular/core';
import { User } from '@golf-planning/api-interfaces';

@Component({
  selector: 'golf-planning-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input()
  user: User|null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
