import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { ConfigService } from '@/config/config.service';
import { CustomLoggerModule } from '@/logger/logger.module';
import { LoggerService } from '@/logger/logger.service';

import { HttpRequestContextModule } from './http-request-context/http-request-context.module';
import { GeneratorService } from './services/generator.service';

const providers = [ConfigService, GeneratorService, LoggerService];

@Global()
@Module({
  providers,
  imports: [HttpModule, CustomLoggerModule, HttpRequestContextModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
