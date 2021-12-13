
/**
 * Courses
 */
export class Course {
  date: Date;
  hour: string;
  title: string;
  prof: string;
  places: number;

  constructor(date: Date, hour: string, title: string, prof: string, places: number) {
    this.date = date;
    this.hour = hour;
    this.title = title;
    this.prof = prof;
    this.places = places; 
  }
}

/**
 * Users
 */
 export class User {
  academiergolf_login: string;
  academiergolf_password: string;

  courses: void | Course[] = undefined;

  constructor(login: string, password: string) {
    this.academiergolf_login = login;
    this.academiergolf_password = password;
  }

}

/**
 * Events
 */
 export enum EventType {
  NEW_COURSE = 'NEW_COURSE',
  UNKNOWN = 'UNKNOWN',
}

export class Event {
  private type: EventType | undefined = undefined;

  isNewCourse(): boolean {
    return this.type == EventType.NEW_COURSE;
  }
}
