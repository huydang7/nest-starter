import { AbstractEntity } from './shared/common/abstract.entity';
import { AbstractDto } from './shared/common/dto/abstract.dto';
import { PageDto } from './shared/common/dto/page.dto';
import { PageMetaDto } from './shared/common/dto/page-meta.dto';

declare global {
  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[]): Dto[];
    toPageDto<Dto extends AbstractDto>(this: T[], pageMetaDto: PageMetaDto): PageDto<Dto>;
  }
}

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto) {
  return new PageDto(this.toDtos(), pageMetaDto);
};

const convertItemToDto = <Entity extends AbstractEntity<Dto>, Dto extends AbstractDto>(
  item: Entity
): Dto => {
  const dto: Dto = item.toDto();

  for (const prop in dto) {
    if (dto[prop] instanceof AbstractEntity) {
      dto[prop] = convertItemToDto(dto[prop] as AbstractEntity) as any;
    }
  }

  return dto;
};

Array.prototype.toDtos = function <
  Entity extends AbstractEntity<Dto>,
  Dto extends AbstractDto
>(): Dto[] {
  const items: Entity[] = this as Entity[];

  return items.map((item) => convertItemToDto<Entity, Dto>(item));
};
