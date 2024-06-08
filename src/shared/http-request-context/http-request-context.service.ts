import { Injectable, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';

import { HeaderKey } from '@/constants/http-request.constant';

export class HttpRequestContext {
  constructor(
    public requestId?: string,
    public systemId?: string
  ) {}
}

@Injectable()
export class HttpRequestContextService {
  private readonly logger = new Logger(HttpRequestContextService.name);

  private static asyncLocalStorage = new AsyncLocalStorage<HttpRequestContext>();

  runWithContext(req: Request, _res: Response, next: NextFunction) {
    const context = new HttpRequestContext();
    context.requestId = req.headers[HeaderKey.X_REQUEST_ID] as string;
    this.logger.debug(`----- Run with context %j`, context);
    HttpRequestContextService.asyncLocalStorage.run(context, () => {
      next();
    });
  }

  getRequestId() {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();
    return reqContext?.requestId;
  }

  setRequestId(id: string) {
    const reqContext = HttpRequestContextService.asyncLocalStorage.getStore();

    this.logger.debug(`-----Context BEFORE is %j`, reqContext);

    if (reqContext) {
      reqContext.requestId = id;
    }

    this.logger.debug(`-----Context AFTER is %j`, reqContext);
  }
}
