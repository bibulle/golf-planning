import { Injectable } from '@angular/core';
import { Config, Filter } from '@golf-planning/api-interfaces';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private filterSubject: BehaviorSubject<Filter[]>;

  config: Config | null = null;
  private _currentConfigSubscription: Subscription | null = null;


  constructor(private readonly _userService: UserService) {

    this.filterSubject = new BehaviorSubject<Filter[]>([]);

    this._currentConfigSubscription = _userService.configObservable().subscribe((config) => {
      this.config = config;
      this.filterSubject.next(config.filters);
    });

  }

  // Configuration management
  filterObservable(): Observable<Filter[]> {
    return this.filterSubject;
  }

  updateFilter(filter: Filter) {
    if (this.config) {
      this.config.filters = this.config?.filters.map((f) => {
        return f.id === filter.id ? filter : f;
      });
      this._userService.updateConfig(this.config);
    }
  }

}
