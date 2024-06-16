import { FactoryProvider } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
export declare const MAILER_SERVICE: unique symbol;
export type MailerService = Transporter<SMTPTransport.SentMessageInfo>;
export type Response = SMTPTransport.SentMessageInfo;
export type Options = SMTPTransport.Options;
export declare const MAILER: FactoryProvider<Transporter<SMTPTransport.SentMessageInfo> | undefined>;
//# sourceMappingURL=mailer.d.ts.map