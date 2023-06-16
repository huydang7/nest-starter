import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/decorators/transform.decorator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly otp: string;
}
