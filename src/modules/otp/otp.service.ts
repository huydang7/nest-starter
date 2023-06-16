import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { customAlphabet } from 'nanoid';
import { Repository } from 'typeorm';

import { CreateOtpDto } from './dto/create-otp.dto';
import { OtpType } from './dto/otp.dto';
import { OtpEntity } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>
  ) {}

  generate6DigitOtp() {
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    const otp = nanoid();
    return otp;
  }

  create(createOtpDto: CreateOtpDto) {
    return this.otpRepository.save({
      ...createOtpDto,
      otp: this.generate6DigitOtp(),
    });
  }

  async verify(otp: string) {
    const otpResult = await this.otpRepository.findOneBy({
      otp,
    });
    if (!otpResult) {
      return null;
    }
    const isExpired = otpResult.expiredAt < new Date();
    if (isExpired) {
      return null;
    }

    return otpResult;
  }

  remove(otp: string) {
    return this.otpRepository.delete({
      otp,
    });
  }

  removeAllByUserIdAndType(userId: string, type: OtpType) {
    return this.otpRepository.delete({
      userId,
      type,
    });
  }
}
