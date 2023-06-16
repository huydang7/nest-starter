import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from 'src/constants';
import { Auth } from 'src/decorators';
import { PageOptionsDto } from 'src/shared/common/dto/page.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Auth([Role.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Auth([Role.ADMIN])
  findAll(@Query() pageOption: PageOptionsDto) {
    return this.userService.findAll(pageOption);
  }

  @Get(':id')
  @Auth([Role.ADMIN])
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return user.toDto();
  }

  @Patch(':id')
  @Auth([Role.ADMIN])
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return user.toDto();
  }

  @Delete(':id')
  @Auth([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
