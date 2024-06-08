import { AbstractDto } from '@/shared/common/dto/abstract.dto';

export enum OtpType {
  'RESET_PASSWORD' = 'RESET_PASSWORD',
}

export class OtpDto extends AbstractDto {
  otp: string;
  expiredAt: Date;
  type: OtpType;
  userId: string;

  constructor(otp: Partial<OtpDto>) {
    super(otp);
    Object.assign(this, otp);
  }
}
