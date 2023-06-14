import { Injectable } from '@nestjs/common';
import { MailAdapterFactory, MailAdapterInterface } from 'src/adapters/mail.factory';

@Injectable()
export class MailService {
  emailAdapter: MailAdapterInterface;
  constructor(private mailAdapterFactory: MailAdapterFactory) {
    this.emailAdapter = this.mailAdapterFactory.getInstance('google');
  }
}
