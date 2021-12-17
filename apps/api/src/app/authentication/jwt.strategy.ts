import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

class RealJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  readonly logger = new Logger(RealJwtStrategy.name);

  constructor(jwtSecret: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret
    });
    this.logger.debug(jwtSecret);

  }

  //noinspection JSMethodCanBeStatic
  async validate(payload, done: any) {
    //this.logger.debug("validate");
    try {
      done(null, payload);
    } catch (err) {
      throw new UnauthorizedException('unauthorized', err.message);
    }
  }
}

@Injectable()
export class JwtStrategy {
  constructor(private readonly _configService: ConfigService) {
    this.strategy = new RealJwtStrategy(this._configService.get("AUTHENT_JWT_SECRET"));
  }

  strategy: RealJwtStrategy;
}
