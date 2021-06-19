export class BaseError extends Error {
  httpCode: number;
  errorCode?: number;
  stack?: string;

  constructor(
    message: string,
    httpCode: number,
    errorCode?: number,
    stack?: string,
  ) {
    super(message);
    this.httpCode = httpCode;
    this.errorCode = errorCode;
    this.stack = stack;
  }
}
