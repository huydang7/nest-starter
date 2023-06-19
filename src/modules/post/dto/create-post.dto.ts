import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { PostMediaContent } from './post.dto';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  tagId: string;

  createdByUserId: string;

  @ValidateNested()
  @Type(() => PostMediaContent)
  mediaContent: PostMediaContent;
}
