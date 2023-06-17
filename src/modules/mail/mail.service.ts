import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { MailAdapterFactory, MailAdapterInterface } from 'src/adapters/mail.factory';
@Injectable()
export class MailService {
  private emailAdapter: MailAdapterInterface;
  constructor(private mailAdapterFactory: MailAdapterFactory) {
    this.emailAdapter = this.mailAdapterFactory.getInstance('ses');
  }

  async loadTemplate(templateName: string) {
    return handlebars.compile(
      readFileSync(path.join(__dirname, `../../../modules/mail/templates/${templateName}.hbs`), {
        encoding: 'utf-8',
      })
    );
  }

  sendResetPasswordEmail = async (to: string, otp: string) => {
    const template = await this.loadTemplate('forgot-password');

    this.emailAdapter.send([to], {
      subject: 'Reset password',
      body: template({
        otp,
      }),
    });
  };
}
