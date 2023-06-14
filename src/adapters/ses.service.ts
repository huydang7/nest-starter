import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

import { MailAdapterInterface } from './mail.factory';

export interface EmailAddresses {
  toAddress: string;
  fromAddress?: string;
}

@Injectable()
export class SESAdapter implements MailAdapterInterface {
  constructor(private configService: ConfigService) {}

  async send(to: string[], emailContent: { body: string; subject: string }): Promise<void> {
    // Create sendEmail params
    const params = {
      Destination: {
        ToAddresses: to,
      },
      Source: this.configService.googleMailConfig.sendFrom,
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailContent.body,
          },
          Text: {
            Charset: 'UTF-8',
            Data: emailContent.body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: emailContent.subject,
        },
      },
    };

    console.log(params);

    return;
  }
}
