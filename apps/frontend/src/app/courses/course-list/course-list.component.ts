import { Component, OnDestroy, OnInit } from '@angular/core';
import { Course, Filter, FilterType } from '@golf-planning/api-interfaces';
import { Subscription } from 'rxjs';
import { FilterService } from '../../filter/filter.service';
import { CourseService } from '../course.service';

@Component({
  selector: 'golf-planning-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  filtredCourses: Course[] = [];

  filters: Filter[] = [];
  private _currentFilterSubscription: Subscription | null = null;

  constructor(private _courseService: CourseService, private readonly _filterService: FilterService) {}

  ngOnInit(): void {
    this._courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
      this.doFilter();
    });
    this._currentFilterSubscription = this._filterService.filterObservable().subscribe((filters) => {
      // console.log(filters);
      this.filters = filters;
      this.doFilter();
    });
  }

  ngOnDestroy() {
    if (this._currentFilterSubscription) {
      this._currentFilterSubscription.unsubscribe();
    }
  }

  isFirstCourseOfDay(index: number): boolean {
    if (index <= 0) {
      return true;
    }
    return this.filtredCourses[index - 1].date.getDay() !== this.filtredCourses[index].date.getDay();
  }

  doFilter() {
    console.log(this.courses);

    this.filtredCourses = this.courses.filter((c) => {
      return this.filters.filter((c) => c.type === FilterType.INVERTED_MATCH).some((f) => f.isVisible(c)) || this.filters.filter((c) => c.type === FilterType.MATCH).every((f) => f.isVisible(c));
    });
  }
}
