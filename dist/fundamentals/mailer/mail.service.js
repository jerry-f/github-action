var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable, Optional } from '@nestjs/common';
import { Config } from '../config';
import { URLHelper } from '../helpers';
import { MAILER_SERVICE } from './mailer';
import { emailTemplate } from './template';
let MailService = class MailService {
    constructor(config, url, mailer) {
        this.config = config;
        this.url = url;
        this.mailer = mailer;
    }
    async sendMail(options) {
        if (!this.mailer) {
            throw new Error('Mailer service is not configured.');
        }
        return this.mailer.sendMail({
            from: this.config.mailer?.from,
            ...options,
        });
    }
    hasConfigured() {
        return !!this.mailer;
    }
    async sendInviteEmail(to, inviteId, invitationInfo) {
        // TODO: use callback url when need support desktop app
        const buttonUrl = this.url.link(`/invite/${inviteId}`);
        const workspaceAvatar = invitationInfo.workspace.avatar;
        const content = `<p style="margin:0">${invitationInfo.user.avatar
            ? `<img
    src="${invitationInfo.user.avatar}"
    alt=""
    width="24px"
    height="24px"
    style="width:24px; height:24px; border-radius: 12px;object-fit: cover;vertical-align: middle"
  />`
            : ''}
  <span style="font-weight:500;margin-right: 4px;">${invitationInfo.user.name}</span>
  <span>invited you to join</span>
  <img
    src="cid:workspaceAvatar"
    alt=""
    width="24px"
    height="24px"
    style="width:24px; height:24px; margin-left:4px;border-radius: 12px;object-fit: cover;vertical-align: middle"
  />
  <span style="font-weight:500;margin-right: 4px;">${invitationInfo.workspace.name}</span></p><p style="margin-top:8px;margin-bottom:0;">Click button to join this workspace</p>`;
        const html = emailTemplate({
            title: 'You are invited!',
            content,
            buttonContent: 'Accept & Join',
            buttonUrl,
        });
        return this.sendMail({
            to,
            subject: `${invitationInfo.user.name} invited you to join ${invitationInfo.workspace.name}`,
            html,
            attachments: [
                {
                    cid: 'workspaceAvatar',
                    filename: 'image.png',
                    content: workspaceAvatar,
                    encoding: 'base64',
                },
            ],
        });
    }
    async sendSignUpMail(url, options) {
        const html = emailTemplate({
            title: 'Create AFFiNE Account',
            content: 'Click the button below to complete your account creation and sign in. This magic link will expire in 30 minutes.',
            buttonContent: ' Create account and sign in',
            buttonUrl: url,
        });
        return this.sendMail({
            html,
            subject: 'Your AFFiNE account is waiting for you!',
            ...options,
        });
    }
    async sendSignInMail(url, options) {
        const html = emailTemplate({
            title: 'Sign in to AFFiNE',
            content: 'Click the button below to securely sign in. The magic link will expire in 30 minutes.',
            buttonContent: 'Sign in to AFFiNE',
            buttonUrl: url,
        });
        return this.sendMail({
            html,
            subject: 'Sign in to AFFiNE',
            ...options,
        });
    }
    async sendChangePasswordEmail(to, url) {
        const html = emailTemplate({
            title: 'Modify your AFFiNE password',
            content: 'Click the button below to reset your password. The magic link will expire in 30 minutes.',
            buttonContent: 'Set new password',
            buttonUrl: url,
        });
        return this.sendMail({
            to,
            subject: `Modify your AFFiNE password`,
            html,
        });
    }
    async sendSetPasswordEmail(to, url) {
        const html = emailTemplate({
            title: 'Set your AFFiNE password',
            content: 'Click the button below to set your password. The magic link will expire in 30 minutes.',
            buttonContent: 'Set your password',
            buttonUrl: url,
        });
        return this.sendMail({
            to,
            subject: `Set your AFFiNE password`,
            html,
        });
    }
    async sendChangeEmail(to, url) {
        const html = emailTemplate({
            title: 'Verify your current email for AFFiNE',
            content: 'You recently requested to change the email address associated with your AFFiNE account. To complete this process, please click on the verification link below. This magic link will expire in 30 minutes.',
            buttonContent: 'Verify and set up a new email address',
            buttonUrl: url,
        });
        return this.sendMail({
            to,
            subject: `Verify your current email for AFFiNE`,
            html,
        });
    }
    async sendVerifyChangeEmail(to, url) {
        const html = emailTemplate({
            title: 'Verify your new email address',
            content: 'You recently requested to change the email address associated with your AFFiNE account. To complete this process, please click on the verification link below. This magic link will expire in 30 minutes.',
            buttonContent: 'Verify your new email address',
            buttonUrl: url,
        });
        return this.sendMail({
            to,
            subject: `Verify your new email for AFFiNE`,
            html,
        });
    }
    async sendVerifyEmail(to, url) {
        const html = emailTemplate({
            title: 'Verify your email address',
            content: 'You recently requested to verify the email address associated with your AFFiNE account. To complete this process, please click on the verification link below. This magic link will expire in 30 minutes.',
            buttonContent: 'Verify your email address',
            buttonUrl: url,
        });
        return this.sendMail({
            to,
            subject: `Verify your email for AFFiNE`,
            html,
        });
    }
    async sendNotificationChangeEmail(to) {
        const html = emailTemplate({
            title: 'Email change successful',
            content: `As per your request, we have changed your email. Please make sure you're using ${to} when you log in the next time. `,
        });
        return this.sendMail({
            to,
            subject: `Your email has been changed`,
            html,
        });
    }
    async sendAcceptedEmail(to, { inviteeName, workspaceName, }) {
        const title = `${inviteeName} accepted your invitation`;
        const html = emailTemplate({
            title,
            content: `${inviteeName} has joined ${workspaceName}`,
        });
        return this.sendMail({
            to,
            subject: title,
            html,
        });
    }
    async sendLeaveWorkspaceEmail(to, { inviteeName, workspaceName, }) {
        const title = `${inviteeName} left ${workspaceName}`;
        const html = emailTemplate({
            title,
            content: `${inviteeName} has left your workspace`,
        });
        return this.sendMail({
            to,
            subject: title,
            html,
        });
    }
};
MailService = __decorate([
    Injectable(),
    __param(2, Optional()),
    __param(2, Inject(MAILER_SERVICE)),
    __metadata("design:paramtypes", [Config,
        URLHelper, Object])
], MailService);
export { MailService };
//# sourceMappingURL=mail.service.js.map