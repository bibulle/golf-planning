import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'golf-planning-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger(
      'enterAnimationHorizontal', [
        transition(':enter', [
          style({transform: 'scaleX(0)', opacity: 0}),
          animate('500ms', style({transform: 'scaleX(1)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'scaleX(1)', opacity: 1}),
          animate('300ms', style({transform: 'scaleX(0)', opacity: 0}))
        ])
      ]
    ),
    trigger(
      'enterAnimationVertical', [
        transition(':enter', [
          style({transform: 'scaleY(0)', opacity: 0}),
          animate('500ms', style({transform: 'scaleY(1)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'scaleY(1)', opacity: 1}),
          animate('300ms', style({transform: 'scaleY(0)', opacity: 0}))
        ])
      ]
    ),
  ]
})
export class NavbarComponent implements OnInit {

  showUserMenu = false;
  showMobileMenu = false;

  links: { path?: string; label: string; icon: string; selected: boolean }[] = [];
  linksUser: { path?: string; label: string; icon: string; selected: boolean }[] = [];

  constructor(private _router: Router) {
    const newLinks: { path?: string; label: string; icon: string; selected: boolean }[] = [];
    const newLinksUser: { path?: string; label: string; icon: string; selected: boolean }[] = [];
    this._router.config.forEach((obj) => {
      if (obj && !obj.redirectTo && obj.data && obj.data['menu']) {
        newLinks.push({
          path: obj.path,
          label: obj.data['label'],
          icon: obj.data['icon'],
          selected: false,
        });
      }
      if (obj && !obj.redirectTo && obj.data && obj.data['userMenu']) {
        newLinksUser.push({
          path: obj.path,
          label: obj.data['label'],
          icon: obj.data['icon'],
          selected: false,
        });
      }
    });
    this.links = newLinks;
    this.linksUser = newLinksUser;
    console.log(this.links);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this._router.events.subscribe((data) => {
      //console.log(data.constructor.name);
      if (data instanceof NavigationEnd) {
        this.links.forEach((link) => {
          link.selected = '/' + link.path === data.urlAfterRedirects;
        });
      }
    });
  }

  getIconAttr(name: string):string {
    return "assets/img/symbol-defs.svg#"+name;
  }
}
