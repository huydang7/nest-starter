import { compact, map } from 'lodash';

import { AbstractEntity } from './shared/common/abstract.entity';
import { AbstractDto } from './shared/common/dto/abstract.dto';
import { PageDto, PageMetaDto } from './shared/common/dto/page.dto';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };

  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[];

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      options?: unknown
    ): PageDto<Dto>;
  }
}

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto, options?: unknown) {
  return new PageDto(this.toDtos(options), pageMetaDto);
};

Array.prototype.toDtos = function <
  Entity extends AbstractEntity<Dto>,
  Dto extends AbstractDto
>(): Dto[] {
  return compact(map<Entity, Dto>(this as Entity[], (item) => item.toDto()));
};
