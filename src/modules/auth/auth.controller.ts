import { Controller, Body, Post, UseGuards, Get } from '@nestjs/common';
import { User } from '../../decorators/user.decorator';

import { AuthService, LoginPayload, RegisterPayload } from './';
import { UserService } from './../user';
import { JwtAuthGuard } from './jwt-guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() payload: LoginPayload): Promise<any> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }

  @Post('register')
  async register(@Body() payload: RegisterPayload): Promise<any> {
    const user: any = await this.userService.create(payload);
    return await this.authService.createToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getLoggedInUser(@User() user): Promise<any> {
    return user;
  }
}
