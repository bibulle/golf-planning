import { Component, OnDestroy, OnInit } from '@angular/core';
import { Config, Filter } from '@golf-planning/api-interfaces';
import { Subscription } from 'rxjs';
import { FilterService } from './filter.service';

@Component({
  selector: 'golf-planning-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  animations: [
    // trigger('enterAnimationHorizontal', [
    //   transition(':enter', [style({ transform: 'scaleX(0)', opacity: 0 }), animate('500ms', style({ transform: 'scaleX(1)', opacity: 1 }))]),
    //   transition(':leave', [style({ transform: 'scaleX(1)', opacity: 1 }), animate('300ms', style({ transform: 'scaleX(0)', opacity: 0 }))]),
    // ]),
    // trigger('enterAnimationVertical', [
    //   transition(':enter', [style({ transform: 'scaleY(0)', opacity: 0 }), animate('300ms', style({ transform: 'scaleY(1)', opacity: 1 }))]),
    //   transition(':leave', [style({ transform: 'scaleY(1)', opacity: 1 }), animate('100ms', style({ transform: 'scaleY(0)', opacity: 0 }))]),
    // ]),
  ],
})
export class FilterComponent implements OnInit, OnDestroy {

  config: Config|null = null;
  private _currentConfigSubscription: Subscription | null = null;


  constructor(private readonly _filterService: FilterService) { 

  }

  ngOnInit(): void {
    this._currentConfigSubscription = this._filterService.configObservable().subscribe((config) => {
      // console.log(filters);
      this.config = config;
    });

  }

  ngOnDestroy() {
    if (this._currentConfigSubscription) {
      this._currentConfigSubscription.unsubscribe();
    }
  }

  selectFilterChange(filter: Filter) {
    // console.log(filter);
    filter.selected = !filter.selected;
    this._filterService.updateFilter(filter);
  }
  sortChange() {
    // console.log(filter);
    if (this.config)  {
      this.config.ascendingSort = !this.config.ascendingSort;
      this._filterService.updateSortOrder(this.config.ascendingSort);
      }
  }
}
