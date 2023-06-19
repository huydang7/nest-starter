import { UseDto } from 'src/decorators/use-dto.decorator';
import { TagEntity } from 'src/modules/tag/entities/tag.entity';
import { AbstractEntity } from 'src/shared/common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { PostDto, PostMediaContent } from '../dto/post.dto';

@Entity({ name: 'posts' })
@UseDto(PostDto)
export class PostEntity extends AbstractEntity<PostDto> {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid' })
  tagId: string;

  @ManyToOne(() => TagEntity)
  @JoinColumn({ name: 'tag_id' })
  tag: TagEntity;

  @Column({ type: 'uuid' })
  createdByUserId: string;

  @Column({ type: 'jsonb', nullable: true })
  mediaContent: PostMediaContent;
}
