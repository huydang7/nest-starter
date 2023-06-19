import { AbstractDto } from 'src/shared/common/dto/abstract.dto';

import type { Constructor } from '../types';

export function UseDto(dtoClass: Constructor<AbstractDto>): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
