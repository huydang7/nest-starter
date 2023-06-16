import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AbstractEntity } from 'src/shared/common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { OtpDto, OtpType } from '../dto/otp.dto';

@Entity({ name: 'otps' })
export class OtpEntity extends AbstractEntity<OtpDto> {
  @Column({ unique: true })
  otp: string;

  @Column({ type: 'timestamptz' })
  expiredAt: Date;

  @Column()
  type: OtpType;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
