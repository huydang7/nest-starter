import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@/config/config.service';
import { AllExceptionsFilter } from '@/exceptions/all-exceptions-filter';
import { TransformInterceptor } from '@/interceptors/response.interceptor';
import { HttpRequestContextMiddleware } from '@/middlewares/http-request-context.middleware';
import { RequestIdHeaderMiddleware } from '@/middlewares/request-id-header.middleware';
import { SharedModule } from '@/shared/shared.module';

import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => {
        return configService.postgresConfig;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    FileModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdHeaderMiddleware, HttpRequestContextMiddleware).forRoutes('*');
  }
}
{
}
