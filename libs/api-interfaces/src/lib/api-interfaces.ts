
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

  users: User[];

  constructor(date: Date, hour: string, title: string, prof: string, places: number) {
    this.date = date;
    this.hour = hour;
    this.title = title;
    this.prof = prof;
    this.places = places; 

    this.users = [];
  }

  getKey() {
    return `${this.date.toISOString().replace(/T.*/,'')} ${this.hour.padStart(5,'0')} ${this.prof}`;
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

  academiergolf_index?: number;
  academiergolf_login?: string;
  academiergolf_password?: string;

  constructor(displayName: string) {
      this.displayName = displayName ;
    }

}

/**
 * Events
 */
 export enum EventType {
  NEW_COURSE = 'NEW_COURSE',
  NEW_PLANNING = 'NEW_PLANNING',
  UNKNOWN = 'UNKNOWN',
}

export class Event {
  private type: EventType | undefined = undefined;

  isNewCourse(): boolean {
    return this.type == EventType.NEW_COURSE;
  }
}
