import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { LoggerService } from './logger.service';
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req(req) {
            const redactedReq = {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              remoteAddress: req.remoteAddress,
              remotePort: req.remotePort,
            };

            return redactedReq;
          },
          res(res) {
            const redactedRes = {
              id: res.id,
              method: res.method,
              url: res.url,
              remoteAddress: res.remoteAddress,
              remotePort: res.remotePort,
            };

            return redactedRes;
          },
        },
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd'T'HH:mm:ss.l'Z'",
            messageFormat: '[{context}] {msg}',
            errorLikeObjectKeys: ['err', 'error'],
          },
        },
      },
    }),
  ],
})
export class CustomLoggerModule {}
