import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthenticationController],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), ConfigModule, UsersModule],
  providers: [AuthenticationService, GoogleStrategy, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
