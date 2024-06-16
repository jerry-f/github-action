import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ModuleConfig } from '../config';
declare module '../config' {
    interface AppConfig {
        /**
         * Configurations for mail service used to post auth or bussiness mails.
         *
         * @see https://nodemailer.com/smtp/
         */
        mailer: ModuleConfig<SMTPTransport.Options>;
    }
}
//# sourceMappingURL=config.d.ts.map