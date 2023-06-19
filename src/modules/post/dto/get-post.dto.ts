import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderKey } from 'src/constants';
import { ToObject } from 'src/decorators';
import { PageOptionsDto } from 'src/shared/common/dto/page.dto';

import { PostDto } from './post.dto';

export class GetPostsDto extends PageOptionsDto {
  @IsNotEmpty()
  @ToObject()
  order: Record<keyof PostDto, OrderKey>;

  @IsOptional()
  @IsString()
  tagId?: string;
}
