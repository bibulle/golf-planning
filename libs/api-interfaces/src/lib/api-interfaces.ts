
/**
 * API content
 */
export interface ApiReturn {
  //version: Version;
  data: Course[] | MyToken;
  refreshToken: string;
}

export interface MyToken {
  id_token: string;
}


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
  displayName: string;

  given_name?: string;
  family_name?: string;
  locale?: string;
  name?: string;
  picture?: string;
  provider?: string;
  providerId?: string;
  isAdmin = false;

  academiergolf_login?: string;
  academiergolf_password?: string;

  courses?: void | Course[] = undefined;

  constructor(displayName: string) {
      this.displayName = displayName ;
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
