import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiConfigService } from 'src/config/config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    {
      ...JwtModule.registerAsync({
        useFactory: (configService: ApiConfigService) => ({
          privateKey: configService.authConfig.privateKey,
          signOptions: {
            expiresIn: configService.authConfig.jwtExpirationTime || '720h',
          },
        }),
        inject: [ApiConfigService],
      }),
      global: true,
    },
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
