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

  static getKey(cousre: Course) {
    return `${cousre.date.toISOString().replace(/T.*/, '')} ${cousre.hour.padStart(5, '0')} ${cousre.prof}`;
  }
}

/**
 * Calendar Event (comming from Google)
 */
export interface CalendarEvent {
  title: string; 
  startDate: Date; 
  endDate: Date
}

/**
 * Google tokens
 */
export interface GoogleToken {
  accessToken: string; 
  refreshToken: string
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
    this.displayName = displayName;
  }
}

/**
 * Events betwen API and frontend
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

/**
 * Config (only use on frontend)
 */
export class Config {
  ascendingSort = false;
  filters: Filter[];

  constructor() {
    this.filters = [
      new Filter("reservé",     FilterType.INVERTED_MATCH, true, "Reservé",          c => c.users.length > 0),
      Filter.getSeparateur(),
      new Filter("0 dispo",     FilterType.MATCH         ,false, "0 place",          c => c.places === 0),
      new Filter("1 dispo",     FilterType.MATCH         ,false, "1 place",          c => c.places === 1),
      new Filter("2 dispo",     FilterType.MATCH         ,true,  "2 places ou plus", c => c.places > 1),
      Filter.getSeparateur(),
      new Filter("bronze",      FilterType.MATCH         ,true,  "Cours bronze",     c => c.title.indexOf("BRONZE") >= 0),
      new Filter("argent",      FilterType.MATCH         ,true,  "Cours argent",     c => c.title.indexOf("ARGENT") >= 0),
      new Filter("gold",        FilterType.MATCH         ,false, "Cours gold",       c => c.title.indexOf("OR") >= 0),
      new Filter("compact",     FilterType.MATCH         ,true,  "Cours compact",    c => c.title.indexOf("COMPACT") >= 0),
      new Filter("parcours",    FilterType.MATCH         ,false, "Cours parcours",   c => c.title.indexOf("PARCOURS") >= 0),
      new Filter("regles",      FilterType.MATCH         ,false, "Cours regles",     c => c.title.indexOf("REGLES") >= 0),
      new Filter("individuel",  FilterType.MATCH         ,false, "Cours individuel", c => c.title.indexOf("INDIVIDUELLE") >= 0),
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

  private static readonly SEPARATEUR= "SEPARATEUR"
  private static separateurCounter = 0;

  id: string;
  type: FilterType;
  label?: string;
  icon?: string;
  selected: boolean;
  match: null | ((c:Course)=>boolean);

  constructor(id: string, type: FilterType, selected: boolean, label: string | null, match: null | ((c:Course)=>boolean), icon?: string) {
    this.id = id;
    this.type = type;
    if (label !== null) {
      this.label = label;
    }
    this.icon = icon;
    this.selected = selected;
    this.match = match;
  }

  static getSeparateur() {
    return new Filter(`${Filter.SEPARATEUR}_${Filter.separateurCounter++}`, FilterType.SEPARATOR, false, null, null)
  }

  isSeparateur():boolean {
    return this.type === FilterType.SEPARATOR
  }

  isVisible(c: Course): boolean {
    // if (this.id === "reservé" ) {
    //   console.log(`${c.title} (${c.users.length}) -> ${this.selected && (this.match === null || this.match(c))} ${c.users.length > 0}`);
      
    // }    
    if (this.type === FilterType.MATCH) {
      return this.selected || this.match === null || !this.match(c) ;
    } else {
      return this.selected && (this.match === null || this.match(c)) ;
    }
  }
}
