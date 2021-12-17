/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import * as passport from 'passport';
import * as expressSession from 'express-session';

import { AppModule } from './app/app.module';
import { LoggingInterceptor } from './app/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());

  // add websocket
  app.useWebSocketAdapter(new WsAdapter(app));

  // Add cors
  //app.use(cors());

  // configure passport (for authentication)
  app.use(
    expressSession({
      secret: 'SECRET_SESSION',
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3333;
  await app
    .listen(port)
    .then(() => {
      Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    })
    .catch((reason) => {
      Logger.error('Error on serveur');
      Logger.error(reason);
    });
}

bootstrap();
