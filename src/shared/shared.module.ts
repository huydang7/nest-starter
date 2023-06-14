import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { CustomLoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';

import { GeneratorService } from './services/generator.service';

const providers = [ConfigService, GeneratorService, LoggerService];

@Global()
@Module({
  providers,
  imports: [HttpModule, CustomLoggerModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
