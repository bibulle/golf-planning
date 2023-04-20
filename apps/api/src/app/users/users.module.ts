import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UtilsModule } from '../utils/utils.module';
import { UsersController } from './users.controller';

@Module({
  imports: [ConfigModule, UtilsModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
