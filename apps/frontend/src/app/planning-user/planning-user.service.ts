import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiReturn, Course, User } from '@golf-planning/api-interfaces';
import { BehaviorSubject, catchError, NEVER, Observable } from 'rxjs';
import { NotificationService } from '../notification/notification.service';
import { EventsService } from '../services/events.service';

@Injectable({
  providedIn: 'root',
})
export class PlanningUserService {
  private _planning: Course[] = [];
  private _planningSubject: BehaviorSubject<Course[]> = new BehaviorSubject(this._planning);

  private _users: User[] = [];
  private _usersSubject: BehaviorSubject<User[]> = new BehaviorSubject(this._users);

  constructor(private _http: HttpClient, private _eventService: EventsService, private _notificationService: NotificationService) {
    this._fetchCourses();
    this._fetchUsers();

    this._eventService.getEventNewCourse().subscribe(() => this._fetchCourses());
    this._eventService.getEventNewUsers().subscribe(() => this._fetchUsers());
  }

  private _fetchCourses() {
    // console.log('fetch');
    this._http.get<ApiReturn>('/api/courses').subscribe((data) => {
      const planning = data.data as Course[];
      //console.log(courses);
      this._planningSubject.next(
        planning
          .map((c) => {
            c.date = new Date(c.date);
            return c;
          })
          .reverse()
      );
    });
  }
  private _fetchUsers() {
    // console.log('fetch');
    this._http.get<ApiReturn>('/api/users').subscribe((data) => {
      const users = data.data as User[];
      console.log(users);
      this._usersSubject.next(users);
    });
  }

  registerUser(course: Course, user: User) {
    this._http
      .post<ApiReturn>('api/courses/register', {
        courseId: course.golf_evt_id,
        golfId: course.golf_id,
        userIndex: user.academiergolf_index,
      })
      .pipe(
        catchError((err) => {
          if (err.error && err.error.message) {
            console.error(err.error.message);
            this._notificationService.error(err.error.message);
          } else {
            console.error(err.statusText);
            this._notificationService.error(err.statusText);
          }
          return NEVER;
        })
      )
      .subscribe(() => {
        this._notificationService.success(`Enregistrement reussi (${user.displayName})`);
        //console.log(`Enregistrement reussi (${user.displayName})`);
      });
  }

  getPlanning(): Observable<Course[]> {
    return this._planningSubject.asObservable();
  }
  getUsers(): Observable<User[]> {
    return this._usersSubject.asObservable();
  }
}
