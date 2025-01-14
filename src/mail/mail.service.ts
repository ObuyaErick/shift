import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SentMessageInfo } from 'nodemailer';

export type HBSTemplates =
  | 'password-reset'
  | 'otp-request'
  | 'initial-registration';

export type Email = string;

export interface MailOptions {
  subject: string;
  template: HBSTemplates;
  to: Email;
  from?: Email;
}

export interface HBSContext {}

export interface PasswordResetRequestHBSContext {
  name: string;
  uiURL: string;
  otp: string;
}

export interface OtpRequestHBSContext {
  name: string;
  otp: string;
}

export interface InitialRegistrationHBSContext {
  name: string;
  uiURL: string;
  otp: string;
}

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async send(spec: {
    options: MailOptions;
    context: HBSContext;
  }): Promise<SentMessageInfo> {
    return await this.mailerService
      .sendMail({
        to: spec.options.to,
        from: spec.options.from || this.configService.get<string>('MAIL_FROM'),
        subject: spec.options.subject,
        template: spec.options.template,
        context: spec.context,
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'Sorry! An internal server error occured. Please try again later.',
        );
      });
  }

  async sendInitialRegistrationOtp(spec: {
    options: MailOptions;
    context: InitialRegistrationHBSContext;
  }) {
    return await this.send({
      options: spec.options,
      context: spec.context,
    });
  }

  async sendPasswordResetRequestMail(spec: {
    options: MailOptions;
    context: PasswordResetRequestHBSContext;
  }) {
    return await this.send({
      options: spec.options,
      context: spec.context,
    });
  }

  async sendOtpRequestMail(spec: {
    options: MailOptions;
    context: OtpRequestHBSContext;
  }) {
    return await this.send({
      options: spec.options,
      context: spec.context,
    });
  }
}
