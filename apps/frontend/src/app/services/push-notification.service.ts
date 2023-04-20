import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ConfigService } from '../utils/config/config.service';
import { HttpClient } from '@angular/common/http';
import { ApiReturn } from '@golf-planning/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private readonly _http: HttpClient, private swPush: SwPush, private configService: ConfigService) {}

  subscribeToNotifications(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const config = this.configService.getConfig();

      if (!config) {
        console.error('Pas de configuration disponible');
        return reject('Pas de configuration disponible');
      }
      if (!config.vapidPublicKey || config.vapidPublicKey.trim().length === 0) {
        console.error('Pas de VAPID disponible');
        return reject('Pas de VAPID disponible');
      }

      this.swPush
        .requestSubscription({
          serverPublicKey: config.vapidPublicKey,
        })
        .then((sub) => {
          // console.log('Subscribed');
          // console.log(sub);

          this.sendToBackend(sub);
          return resolve();
        })
        .catch((err) => {
          console.error('Could not subscribe to notifications', err);
          return reject(`Could not subscribe to notifications ${err}`);
        });
    });
  }

  sendToBackend(sub: PushSubscription) {
    this._http
      .post<ApiReturn | undefined>('/api/users/subscription', sub, {})
      // .timeout(3000)
      .toPromise()
      .then(() => {
        // console.log('subscription sent');
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((error) => {
        console.error(error);
      });
  }
}
