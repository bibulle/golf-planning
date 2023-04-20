import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { CalendarModule } from './calendar/calendar.module';
import { CoursesModule } from './courses/courses.module';
import { EventsModule } from './events/events.module';
import { HealthModule } from './health/health.module';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { ParcoursModule } from './parcours/parcours.module';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot(), EventsModule, CoursesModule, UsersModule, AuthenticationModule, CalendarModule, ParcoursModule, HealthModule, UtilsModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RefreshTokenInterceptor,
    },
  ],
})
export class AppModule {}
