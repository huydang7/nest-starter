import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'src/config/config.service';
import { AllExceptionsFilter } from 'src/exceptions/all-exceptions-filter';
import { TransformInterceptor } from 'src/interceptors/response.interceptor';
import { SharedModule } from 'src/shared/shared.module';

import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { MailModule } from '../mail/mail.module';
import { PostModule } from '../post/post.module';
import { TagModule } from '../tag/tag.module';
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
    PostModule,
    TagModule,
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
export class AppModule {}
