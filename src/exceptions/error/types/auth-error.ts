import { BaseError } from './base-error';

export class AuthError extends BaseError {
  constructor(message: string, errorCode?: number, stack?: string) {
    super(message, 401, errorCode || 401, stack);
  }
}
