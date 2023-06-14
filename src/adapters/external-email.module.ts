import { Module } from '@nestjs/common';

import { GoogleMailAdapter } from './google-mail.service';
import { MailAdapterFactory } from './mail.factory';
import { SESAdapter } from './ses.service';

@Module({
  providers: [SESAdapter, GoogleMailAdapter, MailAdapterFactory],
  imports: [],
  exports: [SESAdapter, GoogleMailAdapter, MailAdapterFactory],
})
export class ExternalEmailModule {}
