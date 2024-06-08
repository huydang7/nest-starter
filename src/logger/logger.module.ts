import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { ConfigService } from '@/config/config.service';
import { HeaderKey } from '@/constants/http-request.constant';

import { LoggerService } from './logger.service';
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          formatters: {
            level: (label: string) => ({ level: label }),
          },
          serializers: {
            req(req) {
              const redactedReq: any = {
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                remoteAddress: req.remoteAddress,
                remotePort: req.remotePort,
              };
              if (configService.logLevel === 'debug' || configService.logLevel === 'trace') {
                redactedReq.body = req.raw.body;
              }
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
          customReceivedMessage: (req) => {
            return 'Request received: ' + req.headers[HeaderKey.X_REQUEST_ID];
          },
          customSuccessMessage: (_req, res) => {
            return 'Request completed: ' + res.req.headers[HeaderKey.X_REQUEST_ID];
          },
          customErrorMessage: (_error, res) => {
            return 'Request errored: ' + res.req.headers[HeaderKey.X_REQUEST_ID];
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CustomLoggerModule {}
