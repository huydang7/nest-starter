import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from 'src/shared/common/utils';
import type { Role } from 'src/constants';
import { TokenType } from 'src/constants';
import { ApiConfigService } from 'src/config/config.service';
import { UserService } from '../user/user.service';
import type { UserLoginDto } from './dto/user-login.dto';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async createAccessToken(data: { role: Role; userId: string }) {
    return {
      expires: dayjs()
        .add(this.configService.authConfig.jwtExpirationTime, 'second')
        .format(),
      token: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    };
  }

  async validateUser(userLoginDto: UserLoginDto) {
    const user = await this.userService.findOneByEmail(userLoginDto.email);

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
