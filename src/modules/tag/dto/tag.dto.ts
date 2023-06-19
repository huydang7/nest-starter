import { AbstractDto } from 'src/shared/common/dto/abstract.dto';

export enum TagType {
  'LOCATION' = 'LOCATION',
  'RESTAURANT' = 'RESTAURANT',
}

export class TagDto extends AbstractDto {
  name: string;
  type: TagType;
}
