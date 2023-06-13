import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Auth, User } from 'src/decorators';
import { UserDto } from '../user/dto/user-dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserLoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() userLoginDto: UserLoginDto) {
    const user = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: user.id,
      role: user.role,
    });

    return new UserLoginPayloadDto(user, {
      access: {
        value: token.token,
        expires: token.expires,
      },
    });
  }

  @Post('register')
  async userRegister(@Body() userRegisterDto: UserRegisterDto) {
    const user = await this.userService.create(userRegisterDto);
    const token = await this.authService.createAccessToken({
      userId: user.id,
      role: user.role,
    });

    return { token: token };
  }

  @Get('me')
  @Auth()
  getCurrentUser(@User() user: UserDto) {
    return user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: any) {
    throw new Error('Not implemented');
  }
}
