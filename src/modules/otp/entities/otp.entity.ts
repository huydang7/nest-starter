import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserEntity } from '@/modules/user/entities/user.entity';
import { AbstractEntity } from '@/shared/common/abstract.entity';

import { OtpDto, OtpType } from '../dto/otp.dto';

@Entity({ name: 'otps' })
export class OtpEntity extends AbstractEntity<OtpDto> {
  @Column({ unique: true })
  otp: string;

  @Column({ type: 'timestamptz' })
  expiredAt: Date;

  @Column({
    type: 'enum',
    enum: OtpType,
  })
  type: OtpType;

  @Column({
    type: 'uuid',
  })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
