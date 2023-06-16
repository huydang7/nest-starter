import { OtpType } from './otp.dto';

export class CreateOtpDto {
  expiredAt: string;
  type: OtpType;
  userId: string;
}
