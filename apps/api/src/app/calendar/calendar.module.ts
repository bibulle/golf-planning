import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from '../courses/courses.module';
import { EventsModule } from '../events/events.module';
import { ParcoursModule } from '../parcours/parcours.module';
import { CalendarService } from './calendar.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [ConfigModule, CoursesModule, ParcoursModule, EventsModule, UtilsModule],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
