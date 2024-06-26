import { Injectable } from '@nestjs/common';

import { GoogleMailAdapter } from './google-mail.service';
import { SESAdapter } from './ses.service';

export interface MailAdapterInterface {
  send(
    to: string[],
    emailContent: {
      body: string;
      subject: string;
    }
  ): void;
}

@Injectable()
export class MailAdapterFactory {
  constructor(
    private readonly googleMailAdapter: GoogleMailAdapter,
    private sesMailAdapter: SESAdapter
  ) {}

  getInstance(type: 'google' | 'ses'): MailAdapterInterface {
    if (type === 'google') {
      return this.googleMailAdapter;
    }
    return this.sesMailAdapter;
  }
}
