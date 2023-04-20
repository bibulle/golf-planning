import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import webpush = require('web-push');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PushNotificationService {
  readonly logger = new Logger(PushNotificationService.name);

  constructor(private readonly _dbService: DbService, private readonly _configService: ConfigService) {
    const vapidPublicKey = this._configService.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = this._configService.get('VAPID_PRIVATE_KEY');

    if (!vapidPublicKey || !vapidPrivateKey) {
      this.logger.error('VAPID key must be defined !!!');
    }
    webpush.setVapidDetails('mailto:famille.martin@gmail.com', vapidPublicKey, vapidPrivateKey);
  }
  async sendNotification(message: string) {
    this.logger.debug('sendNotification');
    const notificationPayload = {
      notification: {
        title: "Bibulle's golf",
        body: message,
        icon: 'assets/icon.svg',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
          onActionClick: {
            default: { operation: 'openWindow', url: '/planning' },
          },
        },
        actions: [
          {
            action: 'default',
            title: 'Go to the site',
          },
        ],
      },
    };
    // const notificationPayload = undefined;
    // const notificationPayload = "hello";
    console.log(notificationPayload);

    const allSubscriptions = await this._dbService.getSubscriptions();

    allSubscriptions.forEach((sub) => {
      this.logger.debug('   sendNotification');
      webpush
        .sendNotification(sub, JSON.stringify(notificationPayload))
        .then(() => {
          this.logger.debug('subscriptions sent');
        })
        .catch((err) => {
          this.logger.error('Error sending notification', err);
          this.logger.error(JSON.stringify(err, null, 2));

          if (err.body === 'push subscription has unsubscribed or expired.\n') {
            this._dbService.deleteSubscription(sub);
          }
        });
    });
  }
}
