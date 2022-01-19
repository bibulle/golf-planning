import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from '../courses/courses.module';
import { EventsModule } from '../events/events.module';
import { CalendarService } from './calendar.service';

@Module({
  imports: [ConfigModule, CoursesModule, EventsModule],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}

