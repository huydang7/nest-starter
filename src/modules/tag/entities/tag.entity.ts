import { UseDto } from 'src/decorators/use-dto.decorator';
import { AbstractEntity } from 'src/shared/common/abstract.entity';
import { Column, Entity } from 'typeorm';

import { TagDto, TagType } from '../dto/tag.dto';

@Entity({ name: 'tags' })
@UseDto(TagDto)
export class TagEntity extends AbstractEntity<TagDto> {
  @Column({ type: 'varchar' })
  type: TagType;

  @Column({ type: 'varchar' })
  name: string;
}
