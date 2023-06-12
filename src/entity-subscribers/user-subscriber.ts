import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { generateHash } from 'src/shared/common/utils';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@EventSubscriber()
export class UserEntitySubscriber
  implements EntitySubscriberInterface<UserEntity>
{
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    const entity = event.entity;

    if (!entity.password) {
      return;
    }

    entity.password = generateHash(entity.password);
  }
}
