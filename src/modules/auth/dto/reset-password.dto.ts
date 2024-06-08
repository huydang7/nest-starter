import { IsNotEmpty, IsString } from 'class-validator';

import { Trim } from '@/decorators/transform.decorator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly otp: string;

  @IsString()
  @Trim()
  readonly newPassword: string;
}
