import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from 'src/config/config.service';
import { GeneratorService } from './services/generator.service';

const providers = [ApiConfigService, GeneratorService];

@Global()
@Module({
  providers,
  imports: [HttpModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
