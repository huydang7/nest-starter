import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { ConfigService } from 'src/config/config.service';
import type { Role } from 'src/constants';
import { TokenType } from 'src/constants';
import { validateHash } from 'src/shared/common/utils';

import { OtpType } from '../otp/dto/otp.dto';
import { OtpService } from '../otp/otp.service';
import { UserService } from '../user/user.service';

import { ResetPasswordDto } from './dto/reset-password.dto';
import type { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private otpService: OtpService
  ) {}

  async createAccessToken(data: { role: Role; userId: string }) {
    return {
      expires: dayjs().add(this.configService.authConfig.jwtExpirationTime, 'second').format(),
      token: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    };
  }

  async createResetPasswordToken(email: string) {
    return {
      expires: dayjs().add(60, 'minute').format(),
      token: await this.jwtService.signAsync({
        email,
        type: TokenType.RESET_PASSWORD_TOKEN,
      }),
    };
  }

  forgotPassword = async (email: string) => {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.otpService.removeAllByUserIdAndType(user.id, OtpType.RESET_PASSWORD);
    const otp = await this.otpService.create({
      userId: user.id,
      type: OtpType.RESET_PASSWORD,
      expiredAt: dayjs().add(10, 'minutes').format(),
    });
    return otp;
  };

  verifyOtp = async (otp: string) => {
    const otpInfo = await this.otpService.verify(otp);
    if (!otpInfo) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  };

  resetPassword = async (resetPassword: ResetPasswordDto) => {
    const { newPassword, otp } = resetPassword;
    const otpInfo = await this.otpService.verify(otp);
    if (!otpInfo) {
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.userService.update(otpInfo.userId, {
      password: newPassword,
    });
    this.otpService.remove(otp);
    const accessToken = await this.createAccessToken({
      userId: otpInfo.userId,
      role: user.role,
    });
    return accessToken;
  };

  async validateUser(userLoginDto: UserLoginDto) {
    const user = await this.userService.findOneByEmail(userLoginDto.email);

    const isPasswordValid = await validateHash(userLoginDto.password, user?.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
