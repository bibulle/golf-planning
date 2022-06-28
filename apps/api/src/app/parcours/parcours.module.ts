import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { ParcoursController } from './parcours.controller';
import { ParcoursService } from './parcours.service';
import { ChronogolfService } from './chronogolf.service';

@Module({
  imports: [UsersModule, EventsModule, ConfigModule],
  controllers: [ParcoursController],
  exports: [ParcoursService],
  providers: [ParcoursService, ChronogolfService]
})
export class ParcoursModule {}
