import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from 'src/config/config.service';

import { OtpModule } from '../otp/otp.module';
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
        useFactory: (configService: ConfigService) => ({
          privateKey: configService.authConfig.privateKey,
          signOptions: {
            expiresIn: configService.authConfig.jwtExpirationTime || '720h',
          },
        }),
        inject: [ConfigService],
      }),
      global: true,
    },
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
