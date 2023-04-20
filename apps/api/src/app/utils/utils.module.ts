import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { ConfigModule } from '@nestjs/config';
import { PushNotificationService } from './push-notification.service';

@Module({
  imports: [ConfigModule],
  providers: [DbService, PushNotificationService],
  exports: [DbService, PushNotificationService],
})
export class UtilsModule {}
