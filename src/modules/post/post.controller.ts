import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Auth, JwtUser, User } from 'src/decorators';

import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsDto } from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostOwnerGuard } from './guards/owner.guard';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth()
  create(@Body() createPostDto: CreatePostDto, @User() user: JwtUser) {
    return this.postService.create({ ...createPostDto, createdByUserId: user.id });
  }

  @Get()
  @Auth()
  findAll(@Query() getPostsDto: GetPostsDto) {
    return this.postService.findAll(getPostsDto);
  }

  @Get(':id')
  @Auth([], { otherGuards: [PostOwnerGuard] })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @Auth([], { otherGuards: [PostOwnerGuard] })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Auth([], { otherGuards: [PostOwnerGuard] })
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
