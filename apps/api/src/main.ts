/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import * as passport from 'passport';
import * as expressSession from 'express-session';

import { AppModule } from './app/app.module';
import { LoggingInterceptor } from './app/interceptors/logging.interceptor';

async function bootstrap() {
  let logger_levels: LogLevel[] = ['error', 'warn', 'log'];
  if (process.env.LOG_LEVEL) {
    switch (process.env.LOG_LEVEL.toUpperCase()) {
      case 'VERBOSE':
        logger_levels = ['error', 'warn', 'log', 'debug', 'verbose'];
        break;
      case 'DEBUG':
        logger_levels = ['error', 'warn', 'log', 'debug'];
        break;
      case 'LOG':
        logger_levels = ['error', 'warn', 'log'];
        break;
      default:
        logger_levels = ['error', 'warn'];
        break;
    }
  }

  const app = await NestFactory.create(AppModule, {
    logger: logger_levels,
  });

  console.log(`LOG_LEVEL : ${process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'LOG (by default)'}`);

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
