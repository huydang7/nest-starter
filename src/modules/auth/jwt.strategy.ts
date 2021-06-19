import { ExtractJwt, Strategy, JwtPayload } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../../config';
import { UserService } from '../user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      ignoreExpiration: true,
      // passReqToCallback: true,
    });
  }

  async validate(jwtPayload: JwtPayload, done) {
    // const { iat, exp } = jwtPayload;
    const { user } = jwtPayload;

    // const timeDiff = exp - iat;
    // if (timeDiff <= 0) {
    //   throw new UnauthorizedException();
    // }

    // const _user = await this.usersService.getById(user._id);
    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password;
    done(null, user);
  }
}
