import { AbstractDto } from 'src/common/dto/abstract.dto';

export class CreateUserDto extends AbstractDto {
  email: string;
  password: string;
}
