import { Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { Config } from '../config';
export const MAILER_SERVICE = Symbol('MAILER_SERVICE');
export const MAILER = {
    provide: MAILER_SERVICE,
    useFactory: (config) => {
        if (config.mailer) {
            const logger = new Logger('Mailer');
            const auth = config.mailer.auth;
            if (auth && auth.user && !('pass' in auth)) {
                logger.warn('Mailer service has not configured password, please make sure your mailer service allow empty password.');
            }
            return createTransport(config.mailer);
        }
        else {
            return undefined;
        }
    },
    inject: [Config],
};
//# sourceMappingURL=mailer.js.map