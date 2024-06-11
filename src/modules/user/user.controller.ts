import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { Role } from '@/constants';
import { Auth } from '@/decorators';
import { PageOptionsDto } from '@/shared/common/dto/page-option.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Auth({
  roles: [Role.ADMIN],
})
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() pageOption: PageOptionsDto,
    @Query()
    query: {
      role: Role[];
    }
  ) {
    return this.userService.findAll(pageOption, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return user.toDto();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return user.toDto();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
