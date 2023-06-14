import { Inject, Injectable } from '@nestjs/common';
import { Params, PARAMS_PROVIDER_TOKEN, PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService extends PinoLogger {
  constructor(@Inject(PARAMS_PROVIDER_TOKEN) params: Params) {
    super(params);
  }
}
