import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_TEMPLATES, type IMailSender } from '../IMailSender.interface';
import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';

/**
 * Продакшн-реализация сервиса отправки почты через SMTP сервер Yandex.
 * Использует Nodemailer для транспорта и Handlebars для рендеринга HTML-шаблонов.
 */
@Injectable()
export class ProdMailSenderService implements IMailSender, OnModuleInit {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(ProdMailSenderService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async send(to: string, message: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to,
        subject: 'Подтверждение регистрации',
        text: message,
        html: message.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>'),
      });

      return true;
    } catch (error) {
      this.logger.error(`Ошибка отправки почты: ${error.message}`);
      return false;
    }
  }

  async sendByTemplate(to: string, templateName: string, data: Record<string, string>): Promise<boolean> {
    const source = readFileSync(MAIL_TEMPLATES[templateName], 'utf-8');
    const template = Handlebars.compile(source);
    const result = template(data);

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to,
        subject: 'Подтверждение регистрации',
        html: result,
      });

      return true;
    } catch (error) {
      this.logger.error(`Ошибка отправки почты: ${error.message}`);
      return false;
    }
  }
}
