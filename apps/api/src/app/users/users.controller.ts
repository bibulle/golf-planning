import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PushSubscription } from 'web-push';
import { DbService } from '../utils/db.service';
import { PushNotificationService } from '../utils/push-notification.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly _dbService: DbService, private readonly _pushNotificationService: PushNotificationService) {}

  @Post('subscription')
  @UseGuards(AuthGuard('jwt'))
  async pushSubscribe(@Body() data: PushSubscription) {
    // this.logger.debug(data);
    return this._dbService
      .pushSubscription(data)
      .catch((err) => {
        // this.logger.debug(err);
        // this.logger.debug('400');
        return Promise.reject({ statusCode: 400, message: err });
      })
      .then(() => {
        // this.logger.debug(v);
        // this.logger.debug('200');
        return { statusCode: 200, message: 'Done' };
      });
  }
}
