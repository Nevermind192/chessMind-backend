import path from 'path';

export const MAIL_TEMPLATES = {
  activation: path.join(__dirname, '../../../templates/activation.html'),
} as const;

type MailTemplate = keyof typeof MAIL_TEMPLATES;

export interface IMailSender {
  /**
   * Отправляет простое текстовое сообщение с базовым форматированием.
   * * @param to - Email получателя.
   * @param message - Текст сообщения (поддерживает базовую разметку звездочками для жирного шрифта).
   * @returns Promise<boolean> - true, если письмо успешно отправлено.
   */
  send(to: string, message: string): Promise<boolean>;
  /**
   * Отправляет письмо на основе Handlebars-шаблона.
   * * @param to - Email получателя.
   * @param templateName - Ключ шаблона из перечисления MAIL_TEMPLATES.
   * @param data - Объект с данными для подстановки в переменные шаблона ({{code}}, {{username}} и т.д.).
   * @returns Promise<boolean> - true, если письмо успешно отправлено.
   */
  sendByTemplate(to: string, templateName: MailTemplate, data: Record<string, string>): Promise<boolean>;
}
