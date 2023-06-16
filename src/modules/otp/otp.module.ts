import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OtpEntity } from './entities/otp.entity';
import { OtpService } from './otp.service';

@Module({
  controllers: [],
  providers: [OtpService],
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  exports: [OtpService],
})
export class OtpModule {}
