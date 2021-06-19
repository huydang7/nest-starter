import { BaseError } from './base-error';

export class ClientError extends BaseError {
  constructor(message: string, errorCode?: number, stack?: string) {
    super(message, 400, errorCode || 400, stack);
  }
}
