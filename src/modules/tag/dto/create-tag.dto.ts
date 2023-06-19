import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { enumToArray } from 'src/shared/common/utils';

import { TagType } from './tag.dto';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(enumToArray(TagType))
  type: TagType;
}
