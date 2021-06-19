import { Controller, Body, Put, Param } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: Partial<CreateUserDto>) {
    return this.userService.update({ _id: id, ...user });
  }
}
