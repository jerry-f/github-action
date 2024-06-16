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
import { randomUUID } from 'node:crypto';
import { BadRequestException, Body, Controller, Get, Header, HttpStatus, Post, Query, Req, Res, } from '@nestjs/common';
import { Config, Throttle, URLHelper } from '../../fundamentals';
import { UserService } from '../user';
import { validators } from '../utils/validators';
import { CurrentUser } from './current-user';
import { Public } from './guard';
import { AuthService, parseAuthUserSeqNum } from './service';
import { TokenService, TokenType } from './token';
class SignInCredential {
}
class MagicLinkCredential {
}
let AuthController = class AuthController {
    constructor(url, auth, user, token, config) {
        this.url = url;
        this.auth = auth;
        this.user = user;
        this.token = token;
        this.config = config;
    }
    async signIn(req, res, credential, redirectUri = this.url.home) {
        validators.assertValidEmail(credential.email);
        const canSignIn = await this.auth.canSignIn(credential.email);
        if (!canSignIn) {
            throw new BadRequestException(`You don't have early access permission\nVisit https://community.affine.pro/c/insider-general/ for more information`);
        }
        if (credential.password) {
            const user = await this.auth.signIn(credential.email, credential.password);
            await this.auth.setCookie(req, res, user);
            res.status(HttpStatus.OK).send(user);
        }
        else {
            // send email magic link
            const user = await this.user.findUserByEmail(credential.email);
            if (!user) {
                const allowSignup = await this.config.runtime.fetch('auth/allowSignup');
                if (!allowSignup) {
                    throw new BadRequestException('You are not allows to sign up.');
                }
            }
            const result = await this.sendSignInEmail({ email: credential.email, signUp: !user }, redirectUri);
            if (result.rejected.length) {
                throw new Error('Failed to send sign-in email.');
            }
            res.status(HttpStatus.OK).send({
                email: credential.email,
            });
        }
    }
    async sendSignInEmail({ email, signUp }, redirectUri) {
        const token = await this.token.createToken(TokenType.SignIn, email);
        const magicLink = this.url.link('/magic-link', {
            token,
            email,
            redirect_uri: redirectUri,
        });
        const result = await this.auth.sendSignInEmail(email, magicLink, signUp);
        return result;
    }
    async signOut(req, res, redirectUri) {
        const session = await this.auth.signOut(req.cookies[AuthService.sessionCookieName], parseAuthUserSeqNum(req.headers[AuthService.authUserSeqHeaderName]));
        if (session) {
            res.cookie(AuthService.sessionCookieName, session.id, {
                expires: session.expiresAt ?? void 0, // expiredAt is `string | null`
                ...this.auth.cookieOptions,
            });
        }
        else {
            res.clearCookie(AuthService.sessionCookieName);
        }
        if (redirectUri) {
            return this.url.safeRedirect(res, redirectUri);
        }
        else {
            return res.send(null);
        }
    }
    async magicLinkSignIn(req, res, { email, token }) {
        if (!token || !email) {
            throw new BadRequestException('Missing sign-in mail token');
        }
        validators.assertValidEmail(email);
        const valid = await this.token.verifyToken(TokenType.SignIn, token, {
            credential: email,
        });
        if (!valid) {
            throw new BadRequestException('Invalid sign-in mail token');
        }
        const user = await this.user.fulfillUser(email, {
            emailVerifiedAt: new Date(),
            registered: true,
        });
        await this.auth.setCookie(req, res, user);
        res.send({ id: user.id, email: user.email, name: user.name });
    }
    async currentSessionUser(user) {
        return {
            user,
        };
    }
    async currentSessionUsers(req) {
        const token = req.cookies[AuthService.sessionCookieName];
        if (!token) {
            return {
                users: [],
            };
        }
        return {
            users: await this.auth.getUserList(token),
        };
    }
    async challenge() {
        // TODO: impl in following PR
        return {
            challenge: randomUUID(),
            resource: randomUUID(),
        };
    }
};
__decorate([
    Public(),
    Post('/sign-in'),
    Header('content-type', 'application/json'),
    __param(0, Req()),
    __param(1, Res()),
    __param(2, Body()),
    __param(3, Query('redirect_uri')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, SignInCredential, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    Get('/sign-out'),
    __param(0, Req()),
    __param(1, Res()),
    __param(2, Query('redirect_uri')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signOut", null);
__decorate([
    Public(),
    Post('/magic-link'),
    __param(0, Req()),
    __param(1, Res()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, MagicLinkCredential]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "magicLinkSignIn", null);
__decorate([
    Throttle('default', { limit: 1200 }),
    Public(),
    Get('/session'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "currentSessionUser", null);
__decorate([
    Throttle('default', { limit: 1200 }),
    Public(),
    Get('/sessions'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "currentSessionUsers", null);
__decorate([
    Public(),
    Get('/challenge'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "challenge", null);
AuthController = __decorate([
    Throttle('strict'),
    Controller('/api/auth'),
    __metadata("design:paramtypes", [URLHelper,
        AuthService,
        UserService,
        TokenService,
        Config])
], AuthController);
export { AuthController };
//# sourceMappingURL=controller.js.map