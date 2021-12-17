import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@golf-planning/api-interfaces';
import { Subscription } from 'rxjs';
import { UserService } from '../user/user.service';

@Component({
  selector: 'golf-planning-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('enterAnimationHorizontal', [
      transition(':enter', [style({ transform: 'scaleX(0)', opacity: 0 }), animate('500ms', style({ transform: 'scaleX(1)', opacity: 1 }))]),
      transition(':leave', [style({ transform: 'scaleX(1)', opacity: 1 }), animate('300ms', style({ transform: 'scaleX(0)', opacity: 0 }))]),
    ]),
    trigger('enterAnimationVertical', [
      transition(':enter', [style({ transform: 'scaleY(0)', opacity: 0 }), animate('500ms', style({ transform: 'scaleY(1)', opacity: 1 }))]),
      transition(':leave', [style({ transform: 'scaleY(1)', opacity: 1 }), animate('300ms', style({ transform: 'scaleY(0)', opacity: 0 }))]),
    ]),
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  showUserMenu = false;
  showMobileMenu = false;

  links: { path?: string; label: string; icon: string; selected: boolean }[] = [];
  linksUser: { path?: string; label: string; icon: string; selected: boolean }[] = [];

  user: User | null = null;
  private _currentUserSubscription: Subscription | null = null;

  constructor(private _router: Router, private _userService: UserService) {
    this.calculateMenus();
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
    this._currentUserSubscription = this._userService.userObservable().subscribe((user) => {
      console.log(user);
      this.user = user;
      this.calculateMenus();
    });
  }
  ngOnDestroy(): void {
    if (this._currentUserSubscription) {
      this._currentUserSubscription.unsubscribe();
    }
  }

  getIconAttr(name: string): string {
    return 'assets/img/symbol-defs.svg#' + name;
  }

  private calculateMenus() {
    const authenticate: boolean = (this.user != null) && (this.user?.given_name != undefined);
    const newLinks: { path?: string; label: string; icon: string; selected: boolean }[] = [];
    const newLinksUser: { path?: string; label: string; icon: string; selected: boolean }[] = [];
    this._router.config.forEach((obj) => {
      if (obj && !obj.redirectTo && obj.data && obj.data['menu'] && (obj.data['authenticate'] === authenticate)) {
        newLinks.push({
          path: obj.path,
          label: obj.data['label'],
          icon: obj.data['icon'],
          selected: false,
        });
      }
      if (obj && obj.data && obj.data['userMenu'] && (obj.data['authenticate'] === authenticate)) {
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
    // console.log(this.links);
  }
}
