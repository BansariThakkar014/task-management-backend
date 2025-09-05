import { Module, Global } from '@nestjs/common';
import { ResponseService } from './services/response.service';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { ConfigService } from '@nestjs/config';
import { MailService } from './services/mail.service';
import { CustomExceptionFilter } from './exception/custom.exception.filter';

@Global()
@Module({
  providers: [
    ResponseService,
    CustomExceptionFilter,
    {
      provide: 'MAIL_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        return nodemailer.createTransport({
          host: configService.get('EMAIL_HOST'),
          port: configService.get('EMAIL_PORT'),
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASS'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'EJS',
      useValue: ejs,
    },
    MailService,
  ],
  exports: [ResponseService, CustomExceptionFilter, MailService],
})
export class CommonModule {}
