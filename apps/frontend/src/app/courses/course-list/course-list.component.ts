import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Config, Course, FilterType, User } from '@golf-planning/api-interfaces';
import { Subscription } from 'rxjs';
import { FilterService } from '../../filter/filter.service';

@Component({
  selector: 'golf-planning-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  courses: Course[] = [];

  filtredCourses: Course[] = [];

  users: User[] = [];

  config: Config | null = null;
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
    this.calculateUser();
    this.doFilter();
  }

  calculateUser() {
    const users: User[] = [];
    this.courses.forEach((c) => {
      c.users.forEach((u) => {
        if (u.academiergolf_index) {
          users[u.academiergolf_index - 1] = u;
        }
      });
    });
    this.users = users;
  }

  isFirstCourseOfDay(index: number): boolean {
    if (index <= 0) {
      return true;
    }
    return this.filtredCourses[index - 1].date.toLocaleDateString() !== this.filtredCourses[index].date.toLocaleDateString();
  }

  doFilter() {
    console.log(this.courses);

    if (this.config != null) {
      this.filtredCourses = this.courses
      .filter((c) => {
        return (
          this.config &&
          (this.config.filters.filter((c) => c.type === FilterType.INVERTED_MATCH).some((f) => f.isVisible(c)) ||
            this.config.filters.filter((c) => c.type === FilterType.MATCH).every((f) => f.isVisible(c)))
        );
      })
      .sort((a,b) => {
        const ascendingSort = (this.config ? this.config.ascendingSort : true);
        return (ascendingSort ? 1 : -1) * Course.getKey(a).localeCompare(Course.getKey(b));
      })
      ;
    }
  }
}
