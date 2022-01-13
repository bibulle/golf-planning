import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, ApiReturn } from '@golf-planning/api-interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventsService } from '../services/events.service';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private _planning: Course[] = [];
  private _planningSubject: BehaviorSubject<Course[]> = new BehaviorSubject(
    this._planning
  );

  constructor(private _http: HttpClient, private _eventService: EventsService) {
    this._fetch();

    this._eventService.getEventNewPlanning().subscribe(() => this._fetch());
  }
 
  private _fetch() {
    // console.log('fetch');
    this._http.get<ApiReturn>('/api/planning').subscribe((data) => {

      const planning = data.data as Course[];
      //console.log(courses);
      this._planningSubject.next(
        planning.map(c => {
          c.date = new Date(c.date)
          return c
        })
        );
    });
  }

  getPlanning(): Observable<Course[]> {
    return this._planningSubject.asObservable();
  }
}
