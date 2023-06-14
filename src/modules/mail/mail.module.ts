import { Module } from '@nestjs/common';
import { ExternalEmailModule } from 'src/adapters/external-email.module';

import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  imports: [ExternalEmailModule],
  exports: [MailService],
})
export class MailModule {}
