import { Config } from '../config';
import { URLHelper } from '../helpers';
import type { MailerService, Options } from './mailer';
export declare class MailService {
    private readonly config;
    private readonly url;
    private readonly mailer?;
    constructor(config: Config, url: URLHelper, mailer?: MailerService | undefined);
    sendMail(options: Options): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    hasConfigured(): boolean;
    sendInviteEmail(to: string, inviteId: string, invitationInfo: {
        workspace: {
            id: string;
            name: string;
            avatar: string;
        };
        user: {
            avatar: string;
            name: string;
        };
    }): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendSignUpMail(url: string, options: Options): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendSignInMail(url: string, options: Options): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendChangePasswordEmail(to: string, url: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendSetPasswordEmail(to: string, url: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendChangeEmail(to: string, url: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendVerifyChangeEmail(to: string, url: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendVerifyEmail(to: string, url: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendNotificationChangeEmail(to: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendAcceptedEmail(to: string, { inviteeName, workspaceName, }: {
        inviteeName: string;
        workspaceName: string;
    }): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendLeaveWorkspaceEmail(to: string, { inviteeName, workspaceName, }: {
        inviteeName: string;
        workspaceName: string;
    }): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
//# sourceMappingURL=mail.service.d.ts.map