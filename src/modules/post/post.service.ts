import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/shared/common/dto/page.dto';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsDto } from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>
  ) {}

  create(createPostDto: CreatePostDto) {
    return this.postRepository.save(createPostDto);
  }

  async findAll(getPostsQuery: GetPostsDto) {
    const result = await this.postRepository
      .createQueryBuilder('post')
      .setFindOptions({
        ...getPostsQuery.query,
        where: {
          tagId: getPostsQuery.tagId,
        },
      })
      .leftJoinAndSelect('post.tag', 'tag')
      .select(['post', 'tag.id', 'tag.name'])
      .getManyAndCount();

    const pageMeta = new PageMetaDto({
      pageOptionsDto: new PageOptionsDto(getPostsQuery),
      itemCount: result[1],
    });
    return new PageDto(result[0], pageMeta);
  }

  findOne(id: string) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['tag'],
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({
      id,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  remove(id: string) {
    return this.postRepository.delete({
      id,
    });
  }

  async isOwnnerOfPost(postId: string, userId: string) {
    const count = await this.postRepository.count({
      where: {
        id: postId,
        createdByUserId: userId,
      },
    });
    return count > 0;
  }
}
