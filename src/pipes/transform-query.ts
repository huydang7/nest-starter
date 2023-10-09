import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import qs from 'qs';

@Injectable()
export class TransformQuery implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      try {
        return qs.parse(value);
      } catch (error) {
        throw new BadRequestException('Invalid query string');
      }
    } else {
      return value;
    }
  }
}
