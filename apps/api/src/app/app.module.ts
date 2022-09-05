import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { EventsModule } from './events/events.module';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { AuthenticationModule } from './authentication/authentication.module';
import { CalendarModule } from './calendar/calendar.module';
import { ParcoursModule } from './parcours/parcours.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot(), EventsModule, CoursesModule, UsersModule, AuthenticationModule, CalendarModule, ParcoursModule, HealthModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RefreshTokenInterceptor,
    },
  ],
})
export class AppModule {}
