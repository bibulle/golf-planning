import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CalendarModule } from '../calendar/calendar.module';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthenticationController],
  imports: [
    PassportModule.register({ 
      accessType: 'offline', 
      prompt: 'consent', 
      approval_prompt: 'force',
      defaultStrategy: 'jwt' 
    }), 
    ConfigModule, 
    UsersModule,
    CalendarModule],
  providers: [AuthenticationService, GoogleStrategy, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
