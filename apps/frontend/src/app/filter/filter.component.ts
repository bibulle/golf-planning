import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Filter } from '@golf-planning/api-interfaces';
import { Subscription } from 'rxjs';
import { FilterService } from './filter.service';

@Component({
  selector: 'golf-planning-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  animations: [
    trigger('enterAnimationHorizontal', [
      transition(':enter', [style({ transform: 'scaleX(0)', opacity: 0 }), animate('500ms', style({ transform: 'scaleX(1)', opacity: 1 }))]),
      transition(':leave', [style({ transform: 'scaleX(1)', opacity: 1 }), animate('300ms', style({ transform: 'scaleX(0)', opacity: 0 }))]),
    ]),
    trigger('enterAnimationVertical', [
      transition(':enter', [style({ transform: 'scaleY(0)', opacity: 0 }), animate('300ms', style({ transform: 'scaleY(1)', opacity: 1 }))]),
      transition(':leave', [style({ transform: 'scaleY(1)', opacity: 1 }), animate('100ms', style({ transform: 'scaleY(0)', opacity: 0 }))]),
    ]),
  ],
})
export class FilterComponent implements OnInit, OnDestroy {
  showFilterMenu = false;

  filters: Filter[] = [];
  private _currentFilterSubscription: Subscription | null = null;


  constructor(private readonly _filterService: FilterService) { 

  }

  ngOnInit(): void {
    this._currentFilterSubscription = this._filterService.filterObservable().subscribe((filters) => {
      // console.log(filters);
      this.filters = filters;
    });

  }

  ngOnDestroy() {
    if (this._currentFilterSubscription) {
      this._currentFilterSubscription.unsubscribe();
    }
  }

  selectChange(filter: Filter) {
    // console.log(filter);
    filter.selected = !filter.selected;
    this._filterService.updateFilter(filter);
  }
}
