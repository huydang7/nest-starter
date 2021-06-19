import { BaseError } from './base-error';

export class ServerError extends BaseError {
  constructor(message: string, errorCode?: number, stack?: string) {
    super(message, 500, errorCode || 500, stack);
  }
}
