import { Module } from '@nestjs/common';
import { CalendarModule } from '../calendar/calendar.module';
import { CoursesModule } from '../courses/courses.module';
import { ParcoursModule } from '../parcours/parcours.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [CalendarModule, CoursesModule, ParcoursModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
