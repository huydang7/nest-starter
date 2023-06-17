import { SendEmailCommand, SendEmailCommandInput, SESClient } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { LoggerService } from 'src/logger/logger.service';

import { MailAdapterInterface } from './mail.factory';
export interface EmailAddresses {
  toAddress: string;
  fromAddress?: string;
}

@Injectable()
export class SESAdapter implements MailAdapterInterface {
  sesClient: SESClient;
  constructor(private configService: ConfigService, private loggerService: LoggerService) {
    this.sesClient = new SESClient({
      region: this.configService.sesMailConfig.awsRegion,
      credentials: {
        secretAccessKey: this.configService.sesMailConfig.awsAccessKey,
        accessKeyId: this.configService.sesMailConfig.awsKeyId,
      },
    });
  }

  async send(to: string[], emailContent: { body: string; subject: string }): Promise<void> {
    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: to,
      },
      Source: `OnCircle <${this.configService.sesMailConfig.sendFrom}>`,
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

    try {
      await this.sesClient.send(new SendEmailCommand(params));
    } catch (e) {
      this.loggerService.error(e);
    }
  }
}
