import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Trim } from 'src/decorators/transform.decorator';
import { Column } from 'typeorm';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  @Column()
  @IsPhoneNumber()
  @IsOptional()
  phone: string;
}
