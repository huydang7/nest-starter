import { Exclude } from 'class-transformer';
import { Role } from 'src/constants';
import { AbstractDto } from 'src/shared/common/dto/abstract.dto';

export class UserDto extends AbstractDto {
  name: string;
  role: Role;
  email: string;
  avatar?: string;
  phone?: string;

  @Exclude()
  password?: string;

  constructor(user: Partial<UserDto>) {
    super(user);
    Object.assign(this, user);
  }
}
