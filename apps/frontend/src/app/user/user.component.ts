import { Component, Input } from '@angular/core';
import { User } from '@golf-planning/api-interfaces';

@Component({
  selector: 'golf-planning-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  @Input()
  user: User|null = null;

  @Input()
  linksUser: { path?: string; label: string; icon: string; selected: boolean }[] = [];


  // constructor() { }

  // ngOnInit(): void {
  //   console.log(this.linksUser);
  // }

}
