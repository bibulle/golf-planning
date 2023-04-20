import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CoursesService } from './courses.service';
import { AcademiegolfService } from './academiegolf.service';
import { EventsModule } from '../events/events.module';
import { ConfigModule } from '@nestjs/config';
import { CoursesController } from './courses.controller';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UsersModule, EventsModule, ConfigModule, UtilsModule],
  providers: [CoursesService, AcademiegolfService],
  exports: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}
