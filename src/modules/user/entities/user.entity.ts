import { Role } from 'src/constants';
import { AbstractEntity } from 'src/shared/common/abstract.entity';
import { Column, Entity } from 'typeorm';

import { UserDto } from '../dto/user-dto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity implements UserDto {
  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;
}
