import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { Trim } from '@/decorators/transform.decorator';

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  readonly email: string;
}
