import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { ConfigService } from 'src/config/config.service';
import type { Role } from 'src/constants';
import { TokenType } from 'src/constants';
import { validateHash } from 'src/shared/common/utils';

import { UserService } from '../user/user.service';

import type { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
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
      throw new UnauthorizedException('Invalid token');
    }
    await this.createResetPasswordToken(email);
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
