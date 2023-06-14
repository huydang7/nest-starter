import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from 'src/config/config.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService
  ) {}

  private readonly logger = new Logger('Exception');

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const request = ctx.getRequest();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: any = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.response?.message || exception.message || exception?.detail,
      error: exception.response?.error || exception.message,
      errorCode: exception.response?.errorCode || exception.errorCode,
    };
    if (this.configService.isDevelopment) {
      responseBody.stack = exception.response?.stack || exception.stack;
    }

    this.logger.error(responseBody);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
