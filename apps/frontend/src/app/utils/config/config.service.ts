import { Injectable } from '@angular/core';
import { Config, Version } from '@golf-planning/api-interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {
    this.versionChangedSubject = new BehaviorSubject<boolean>(false);
  }

  static config: Config;
  static version = new Version();

  private versionChangedSubject: BehaviorSubject<boolean>;

  setConfig(config: Config) {
    // console.log("ConfigService : setConfig")
    ConfigService.config = config;

    if (ConfigService.config.backendVersion) {
      //console.log('Version changed '+new Version().version+' != '+VersionService.backendVersion);
      this.versionChangedSubject.next(ConfigService.version.version !== ConfigService.config.backendVersion);
    }
  }
  getConfig(): Config {
    return ConfigService.config;
  }

  /**
   * Get the observable on version changes
   * @returns {Observable<boolean>}
   */
  versionChangedObservable(): Observable<boolean> {
    return this.versionChangedSubject.pipe(distinctUntilChanged());
  }
}
