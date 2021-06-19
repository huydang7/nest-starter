import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  constructor(message: string, errorCode?: number, stack?: string) {
    super(message, 404, errorCode || 404, stack);
  }
}
