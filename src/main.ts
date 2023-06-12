import {
  ClassSerializerInterceptor,
  ValidationPipe,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import helmet from '@fastify/helmet';
import { AppModule } from 'src/modules/app/app.module';
import { ApiConfigService } from './config/config.service';
import { SharedModule } from './shared/shared.module';
import compression from '@fastify/compress';
import fmp from '@fastify/multipart';
import fstatic from '@fastify/static';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      cors: true,
    },
  );
  await app.register(fstatic, {
    root: path.join(__dirname, 'public'),
  });

  await app.register(helmet, {
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  });
  await app.register(compression);
  await app.register(fmp);

  const reflector = app.get(Reflector);
  const configService = app.select(SharedModule).get(ApiConfigService);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      forbidUnknownValues: false,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const port = configService.appConfig.port;

  await app.listen(port);

  console.info(`server running on ${await app.getUrl()}`);
}
bootstrap();
