/* eslint-disable @typescript-eslint/no-explicit-any */
import { calendar_v3 } from 'googleapis';

/**
 * API content
 */
export interface ApiReturn {
  //version: Version;
  data: Course[] | ParcoursResa[] | ParcoursResa[] | User[] | MyToken | GlobalStatus;
  refreshToken?: string;
  config?: Config;
  stream?: any;
}

export interface MyToken {
  id_token: string;
}

export class GlobalStatus {
  golfStatus = 'OK';
  course?: ServiceStatus;
  courseUser?: { [user_name: string]: ServiceStatus };
  googleUser?: { [user_name: string]: ServiceStatus };
  parcourtUser?: { [user_name: string]: ServiceStatus };
}
export class ServiceStatus {
  ok = false;
  lastLoad?: Date;
  count? = 0;
  error?: string;
}

export class Config {
  backendVersion = '';
  vapidPublicKey = '';
}

/**
 * Courses
 */
export class Course {
  public static readonly TYPE = 'Course';

  type = Course.TYPE;
  date: Date;
  hour: string;
  title: string;
  prof: string;
  places: number;

  golf_evt_id: string;
  golf_id: string;

  users: User[];

  constructor(date: Date, hour: string, title: string, prof: string, places: number, golf_evt_id: string, golf_id: string) {
    this.date = date;
    this.hour = hour;
    this.title = title;
    this.prof = prof;
    this.places = places;
    this.golf_evt_id = golf_evt_id;
    this.golf_id = golf_id;

    this.users = [];
  }

  static getKey(course: Course) {
    if (typeof course.date === 'string') {
      course.date = new Date(course.date);
    }
    return `${course.date.toISOString().replace(/T.*/, '')} ${course.hour.padStart(5, '0')} ${course.prof}`;
  }

  static getFullDate(course: Course): Date {
    const courseDate = new Date(course.date);
    const split = course.hour.split(':');
    courseDate.setHours(+split[0]);
    courseDate.setMinutes(+split[1]);

    return courseDate;
  }
}

export class ParcoursResa {
  public static readonly TYPE = 'Parcours';

  type = ParcoursResa.TYPE;
  holes: number;
  booking_reference: string;
  teetime: Date;
  club_id: number;
  club?: Club;
  course_id: number;
  course?: Parcours;
  users: User[];

  constructor(value: any) {
    //console.log(JSON.stringify(value));
    this.club_id = value.club_id;
    this.holes = value.holes;
    this.booking_reference = value.booking_reference;
    this.teetime = new Date(value.teetime.date + ' ' + value.teetime.start_time);
    this.course_id = value.teetime.course_id;

    this.users = [];
  }

  static getKey(parcours: ParcoursResa) {
    // console.log(parcours);
    if (typeof parcours.teetime === 'string') {
      parcours.teetime = new Date(parcours.teetime);
    }
    return `${parcours.teetime.toISOString()} ${parcours.course_id}`;
  }
}

export class Parcours {
  id: number;
  club_id: number;
  holes: number;
  name: string;

  constructor(value: any) {
    //console.log(JSON.stringify(value));
    this.id = value.id;
    this.club_id = value.club_id;
    this.holes = value.holes;
    this.name = value.name;
    // console.log(JSON.stringify(this));
  }
}
export class Club {
  id: number;
  name: string;
  city: string;
  country: string;
  phone_number: string;

  constructor(value: any) {
    //console.log(JSON.stringify(value));
    this.id = value.id;
    this.name = value.name;
    this.city = value.city;
    this.country = value.country.name;
    this.phone_number = value.phone_number;
    // console.log(JSON.stringify(this));
  }
}

/**
 * Calendar Event (coming from Google)
 */
export type GoogleEvent = calendar_v3.Schema$Event;

/**
 * Google infos
 */
export interface GoogleInfos {
  accessToken: string;
  refreshToken: string;

  golfCalendarId: string;
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
  hasSubscribeToNotification? = false;

  academiegolf_index?: number;
  academiegolf_login?: string;
  academiegolf_password?: string;
  academiegolf_userId?: string;
  chronogolf_login?: string;
  chronogolf_password?: string;

  constructor(displayName: string, academiegolf_index?: number, academiegolf_userId?: string) {
    this.displayName = displayName;
    this.academiegolf_index = academiegolf_index;
    this.academiegolf_userId = academiegolf_userId;
  }
}

/**
 * Events between API and frontend
 */

export enum EventType {
  NEW_COURSE = 'NEW_COURSE',
  NEW_PLANNING = 'NEW_PLANNING',
  NEW_PARCOURS = 'NEW_PARCOURS',
  NEW_USER = 'NEW_USER',
  MESSAGE = 'MESSAGE',
  UNKNOWN = 'UNKNOWN',
}

export class Event {
  type: EventType | undefined = undefined;
  message: string | undefined = undefined;

  isNewCourse(): boolean {
    return this.type == EventType.NEW_COURSE;
  }
}

/**
 * Config (only use on frontend)
 */
export class FrontendConfig {
  ascendingSort = false;
  filters: Filter[];

  constructor() {
    this.filters = [
      new Filter('réservé', FilterType.INVERTED_MATCH, true, 'Réservé', (c) => c.users.length > 0, null),
      new Filter('parcours', FilterType.INVERTED_MATCH, true, 'Parcours', null, (p) => p.type === ParcoursResa.TYPE),
      Filter.getSeparateur(),
      new Filter('0 dispo', FilterType.MATCH, false, '0 place', (c) => c.places === 0, null),
      new Filter('1 dispo', FilterType.MATCH, false, '1 place', (c) => c.places === 1, null),
      new Filter('2 dispo', FilterType.MATCH, true, '2 places ou plus', (c) => c.places > 1, null),
      Filter.getSeparateur(),
      new Filter('cours bronze', FilterType.MATCH, true, 'Cours bronze', (c) => c.title.indexOf('BRONZE') >= 0, null),
      new Filter('cours argent', FilterType.MATCH, true, 'Cours argent', (c) => c.title.indexOf('ARGENT') >= 0, null),
      new Filter('cours gold', FilterType.MATCH, false, 'Cours gold', (c) => c.title.indexOf('OR') >= 0, null),
      new Filter('cours compact', FilterType.MATCH, true, 'Cours compact', (c) => c.title.indexOf('COMPACT') >= 0, null),
      new Filter('cours parcours', FilterType.MATCH, false, 'Cours parcours', (c) => c.title.indexOf('PARCOURS') >= 0, null),
      new Filter('cours règles', FilterType.MATCH, false, 'Cours règles', (c) => c.title.indexOf('REGLES') >= 0, null),
      new Filter('cours individuel', FilterType.MATCH, false, 'Cours individuel', (c) => c.title.indexOf('INDIVIDUELLE') >= 0, null),
    ];
  }
}
/**
 * Filter (only use on frontend)
 */
export enum FilterType {
  SEPARATOR = 'SEPARATOR',
  MATCH = 'MATCH',
  INVERTED_MATCH = 'INVERTED_MATCH',
}
export class Filter {
  private static readonly SEPARATEUR = 'SEPARATEUR';
  private static séparateurCounter = 0;

  id: string;
  type: FilterType;
  label?: string;
  icon?: string;
  selected: boolean;
  matchCourse: null | ((c: Course) => boolean);
  matchParcours: null | ((c: ParcoursResa) => boolean);

  constructor(
    id: string,
    type: FilterType,
    selected: boolean,
    label: string | null,
    matchCourse: null | ((c: Course) => boolean),
    matchParcours: null | ((c: ParcoursResa) => boolean),
    icon?: string
  ) {
    this.id = id;
    this.type = type;
    if (label !== null) {
      this.label = label;
    }
    this.icon = icon;
    this.selected = selected;
    this.matchCourse = matchCourse;
    this.matchParcours = matchParcours;
  }

  static getSeparateur() {
    return new Filter(`${Filter.SEPARATEUR}_${Filter.séparateurCounter++}`, FilterType.SEPARATOR, false, null, null, null);
  }

  isSeparateur(): boolean {
    return this.type === FilterType.SEPARATOR;
  }

  isVisible(c: Course | ParcoursResa): boolean {
    if (this.type === FilterType.MATCH) {
      // Type MATCH (true if every filter is true)
      if (c.type === Course.TYPE) {
        if (this.matchCourse === null) {
          return false;
        }
        return this.selected || !this.matchCourse(c as Course);
      } else {
        if (this.matchParcours === null) {
          return false;
        }
        return this.selected || !this.matchParcours(c as ParcoursResa);
      }
    } else {
      // Type REVERSE MATCH (true if one filter is true)
      if (c.type === Course.TYPE) {
        if (this.matchCourse === null) {
          return false;
        }
        return this.selected && this.matchCourse(c as Course);
      } else {
        if (this.matchParcours === null) {
          return false;
        }
        return this.selected && this.matchParcours(c as ParcoursResa);
      }
    }
  }
}
