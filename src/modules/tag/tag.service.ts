import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/shared/common/dto/page.dto';
import { Repository } from 'typeorm';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagRepository.save(createTagDto);
  }

  async findAll() {
    // TODO: add pagination
    const pageOptionsDto = new PageOptionsDto({ size: 100 });
    const result = await this.tagRepository.findAndCount({
      ...pageOptionsDto.query,
    });
    const pageMeta = new PageMetaDto({
      pageOptionsDto,
      itemCount: result[1],
    });
    return new PageDto(result[0].toDtos(), pageMeta);
  }

  findOne(id: string) {
    return this.tagRepository.findOneBy({
      id,
    });
  }

  update(id: string, updateTagDto: UpdateTagDto) {
    return this.tagRepository.update(id, updateTagDto);
  }

  remove(id: string) {
    return this.tagRepository.delete(id);
  }
}
