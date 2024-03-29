import { Injectable } from '@angular/core';
import { FrontendConfig, Filter } from '@golf-planning/api-interfaces';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private configSubject: BehaviorSubject<FrontendConfig | null>;

  config: FrontendConfig | null = null;
  private _currentConfigSubscription: Subscription | null = null;

  constructor(private readonly _userService: UserService) {
    this.configSubject = new BehaviorSubject<FrontendConfig | null>(null);

    this._currentConfigSubscription = _userService.configObservable().subscribe((config) => {
      this.config = config;
      this.configSubject.next(config);
    });
  }

  // Configuration management
  configObservable(): Observable<FrontendConfig | null> {
    return this.configSubject;
  }

  updateFilter(filter: Filter) {
    if (this.config) {
      this.config.filters = this.config?.filters.map((f) => {
        return f.id === filter.id ? filter : f;
      });
      this._userService.updateConfig(this.config);
    }
  }
  updateSortOrder(ascendingSort: boolean) {
    if (this.config) {
      this.config.ascendingSort = ascendingSort;
      this._userService.updateConfig(this.config);
    }
  }
}
