var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import './config';
import { Global, Module } from '@nestjs/common';
import { OptionalModule } from '../nestjs';
import { MailService } from './mail.service';
import { MAILER } from './mailer';
let MailerModule = class MailerModule {
};
MailerModule = __decorate([
    Global(),
    OptionalModule({
        providers: [MAILER],
        exports: [MAILER],
        requires: ['mailer.host'],
    })
], MailerModule);
let MailModule = class MailModule {
};
MailModule = __decorate([
    Global(),
    Module({
        imports: [MailerModule],
        providers: [MailService],
        exports: [MailService],
    })
], MailModule);
export { MailModule };
export { MailService };
//# sourceMappingURL=index.js.map