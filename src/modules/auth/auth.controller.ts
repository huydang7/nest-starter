import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth, User } from 'src/decorators';

import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserLoginPayloadDto } from './dto/login-payload.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() userLoginDto: UserLoginDto) {
    const user = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: user.id,
      role: user.role,
    });

    return new UserLoginPayloadDto(user.toDto(), {
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

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.otp);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: 'Reset password email sent' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetpasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetpasswordDto);
  }
}
