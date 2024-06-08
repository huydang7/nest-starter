import { Module } from '@nestjs/common';

import { ExternalEmailModule } from '@/adapters/external-email.module';

import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  imports: [ExternalEmailModule],
  exports: [MailService],
})
export class MailModule {}
