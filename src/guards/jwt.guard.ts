import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from 'src/config/config.service';
import { PublicKey } from 'src/constants';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private jwtService: JwtService;
  private jwtStrategy: JwtStrategy;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private userService: UserService
  ) {
    super();
  }

  private readonly logger = new Logger('JwtAuthGuard');

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PublicKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.addUserToPublicRequest(context);
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  // addition
  addUserToPublicRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;
    const token = auth?.replace('Bearer ', '');
    if (token) {
      if (!this.jwtService) {
        this.jwtService = new JwtService({
          secret: this.configService.authConfig.privateKey,
        });
      }
      if (!this.jwtStrategy) {
        this.jwtStrategy = new JwtStrategy(this.configService, this.userService);
      }
      try {
        const tokenPayload = this.jwtService.verify(token, {
          secret: this.configService.authConfig.privateKey,
        });
        request.user = this.jwtStrategy.validate(tokenPayload);
      } catch (error) {
        this.logger.error(error);
      }
    }
  }
}
