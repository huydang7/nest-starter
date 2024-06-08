import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { OAuth2Client } from 'google-auth-library';
import nodemailer, { Transporter } from 'nodemailer';

import { ConfigService } from '@/config/config.service';
import { LoggerService } from '@/logger/logger.service';

import { MailAdapterInterface } from './mail.factory';

export interface EmailAddresses {
  toAddress: string;
}

@Injectable()
export class GoogleMailAdapter implements MailAdapterInterface {
  transport: Transporter;
  constructor(
    private configService: ConfigService,
    private loggerService: LoggerService
  ) {
    this.initMailClient();
  }

  initMailClient = async () => {
    try {
      const MyOAuth2Client = new OAuth2Client(
        this.configService.googleMailConfig.clientId,
        this.configService.googleMailConfig.clientSecret
      );
      MyOAuth2Client.setCredentials({
        refresh_token: this.configService.googleMailConfig.refreshToken,
      });
      const accessTokenObject = await MyOAuth2Client.getAccessToken();
      const accessToken = accessTokenObject?.token;
      if (!accessToken) {
        throw new Error('Access token for mail not found');
      }

      this.transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: this.configService.googleMailConfig.sendFrom.replace(/\\n/g, '\n'),
          clientId: this.configService.googleMailConfig.clientId.replace(/\\n/g, '\n'),
          clientSecret: this.configService.googleMailConfig.clientSecret.replace(/\\n/g, '\n'),
          refreshToken: this.configService.googleMailConfig.refreshToken.replace(/\\n/g, '\n'),
          accessToken: accessToken,
          expires: dayjs().add(50, 'minutes').unix(),
        },
      });

      this.transport
        .verify()
        .then(() => {
          this.loggerService.info('Connected to email server');
        })
        .catch(() => {
          this.loggerService.warn(
            'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
          );
        });
    } catch (error) {
      this.loggerService.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
      );
    }
  };
  async send(
    to: string[],
    emailContent: { body: string; subject: string; cc?: string[] }
  ): Promise<void> {
    try {
      this.loggerService.info(`Send mail to ${to}`);

      const mailOptions = {
        from: `<${this.configService.googleMailConfig.sendFrom}>`,
        to: to,
        subject: emailContent.subject,
        html: emailContent.body,
        cc: emailContent.cc || [],
      };

      this.transport?.sendMail(mailOptions);
      this.loggerService.info(`Send mail to ${to} success`);
    } catch (error) {
      this.loggerService.error(`Send mail to ${to} failed ${error}`);
    }
  }
}
