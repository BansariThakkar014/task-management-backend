import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomHttpException } from '../exception/http-exception';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAIL_TRANSPORT') private readonly transporter: any,
    @Inject('EJS') private readonly ejs: any,
    private readonly configService: ConfigService,
  ) {}

  async sendMail({
    to,
    subject,
    templatePath,
    context,
    attachments,
  }: {
    to: string;
    subject: string;
    templatePath: string;
    context: Record<string, string | number | boolean | object | undefined>;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }): Promise<void> {
    const html: string = await this.ejs.renderFile(templatePath, context);

    const mailOptions: any = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject,
      html,
    };

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    const response = await this.transporter.sendMail(mailOptions);

    if (response && response.messageId == '') {
      throw new CustomHttpException(
        'Failed to send email.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
