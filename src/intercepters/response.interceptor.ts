import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const IgnoredPropertyName = Symbol('IgnoredPropertyName');

export const IgnoreInterceptor = () => {
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value[IgnoredPropertyName] = true;
  };
};

export interface Response<T> {
  statusCode: number;
  message: string;
  result: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const isIgnored = context.getHandler()[IgnoredPropertyName];
    if (isIgnored) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data?.message,
          result: data,
        };
      }),
    );
  }
}
