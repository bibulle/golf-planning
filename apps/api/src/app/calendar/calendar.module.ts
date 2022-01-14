import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from '../courses/courses.module';
import { CalendarService } from './calendar.service';

@Module({
  imports: [ConfigModule, CoursesModule],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}

