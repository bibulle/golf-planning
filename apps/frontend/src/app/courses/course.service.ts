import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '@golf-planning/api-interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventsService } from '../services/events.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private _courses: Course[] = [];
  private _coursesSubject: BehaviorSubject<Course[]> = new BehaviorSubject(
    this._courses
  );

  constructor(private _http: HttpClient, private _eventService: EventsService) {
    this._fetch();

    this._eventService.getEventNewCourse().subscribe(() => this._fetch());
  }

  private _fetch() {
    console.log('fetch');
    this._http.get<Course[]>('/api/courses').subscribe((courses) => {
      //console.log(courses);
      this._coursesSubject.next(
        courses.map(c => {
          c.date = new Date(c.date)
          return c
        })
        );
    });
  }

  getCourses(): Observable<Course[]> {
    return this._coursesSubject.asObservable();
  }
}
