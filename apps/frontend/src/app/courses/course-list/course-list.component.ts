import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FrontendConfig, Course, FilterType, ParcoursResa, User } from '@golf-planning/api-interfaces';
import { Subscription } from 'rxjs';
import { FilterService } from '../../filter/filter.service';

@Component({
  selector: 'golf-planning-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  courses: (Course | ParcoursResa)[] = [];
  filtredCourses: (Course | ParcoursResa)[] = [];

  @Input()
  users: User[] = [];

  config: FrontendConfig | null = null;
  private _currentConfigSubscription: Subscription | null = null;

  constructor(private readonly _filterService: FilterService) {}

  ngOnInit(): void {
    this._currentConfigSubscription = this._filterService.configObservable().subscribe((config) => {
      // console.log(config);
      this.config = config;
      this.doFilter();
    });
  }

  ngOnDestroy() {
    if (this._currentConfigSubscription) {
      this._currentConfigSubscription.unsubscribe();
    }
  }

  ngOnChanges() {
    this.doFilter();
  }

  isFirstCourseOfDay(index: number): boolean {
    if (index <= 0) {
      return true;
    }
    return this.getDate(this.filtredCourses[index - 1]).toLocaleDateString() !== this.getDate(this.filtredCourses[index]).toLocaleDateString();
  }
  isDayInThePast(c: Course | ParcoursResa): boolean {
    return this.getDate(c).toISOString().substring(0, 10) < new Date().toISOString().substring(0, 10);
  }

  doFilter() {
    // console.log(this.courses);

    if (this.config != null) {
      // const items: (Course | Parcours)[] = [];
      // items.concat(this.courses);
      // items.concat(this.parcours);
      this.filtredCourses = this.courses
        .filter((c) => {
          return (
            this.config &&
            (this.config.filters.filter((c) => c.type === FilterType.INVERTED_MATCH).some((f) => f.isVisible(c)) ||
              this.config.filters.filter((c) => c.type === FilterType.MATCH).every((f) => f.isVisible(c)))
          );
        })
        .sort((a, b) => {
          const ascendingSort = this.config ? this.config.ascendingSort : true;
          return (ascendingSort ? 1 : -1) * this.getKey(a).localeCompare(this.getKey(b));
        });
    }
  }

  getDate(item: Course | ParcoursResa): Date {
    if (item.type === Course.TYPE) {
      return Course.getFullDate(item as Course);
    } else {
      return (item as ParcoursResa).teetime;
    }
  }
  getKey(item: Course | ParcoursResa): string {
    if (item.type === Course.TYPE) {
      return Course.getKey(item as Course);
    } else {
      return ParcoursResa.getKey(item as ParcoursResa);
    }
  }
  asCourse(item: Course | ParcoursResa): Course {
    return item as Course;
  }
  asParcours(item: Course | ParcoursResa): ParcoursResa {
    return item as ParcoursResa;
  }
}
