import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'src/shared/common/dto/page.dto';
import { Role } from 'src/constants';
import { Auth } from 'src/decorators';

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
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Auth([Role.ADMIN])
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
