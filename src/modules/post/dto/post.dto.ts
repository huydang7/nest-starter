import { IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { AbstractDto } from 'src/shared/common/dto/abstract.dto';
import { enumToArray } from 'src/shared/common/utils';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export class PostMediaContent {
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  url: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(enumToArray(MediaType))
  type: MediaType;
}

export class PostDto extends AbstractDto {
  id: string;
  content: string;
  tagId: string;
  createdByUserId: string;
  mediaContent: PostMediaContent;

  constructor(post: Partial<PostDto>) {
    super(post);
    Object.assign(this, post);
  }
}
