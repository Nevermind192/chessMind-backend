import { Injectable } from '@nestjs/common';
import { type IMailSender } from '../IMailSender.interface';

@Injectable()
export class DevMailSenderService implements IMailSender {
  async send(to: string, message: string): Promise<boolean> {
    console.log('------ Отправка почты ------');
    console.log(`Кому: ${to} \n ${message}`);
    console.log('----------------------------');

    return true;
  }

  async sendByTemplate(to: string, templateName: string, data: Record<string, string>): Promise<boolean> {
    console.log('------Отправка почты с HTML-шаблоном------');
    console.log(`Кому: ${to} \n ${templateName}`, data);
    console.log('------------------------------------------');

    return true;
  }
}
