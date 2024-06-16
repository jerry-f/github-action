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
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Parent, Query, ResolveField, Resolver, } from '@nestjs/graphql';
import { Config, SkipThrottle, Throttle, URLHelper } from '../../fundamentals';
import { UserService } from '../user';
import { UserType } from '../user/types';
import { validators } from '../utils/validators';
import { CurrentUser } from './current-user';
import { Public } from './guard';
import { AuthService } from './service';
import { TokenService, TokenType } from './token';
let ClientTokenType = class ClientTokenType {
};
__decorate([
    Field(),
    __metadata("design:type", String)
], ClientTokenType.prototype, "token", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], ClientTokenType.prototype, "refresh", void 0);
__decorate([
    Field({ nullable: true }),
    __metadata("design:type", String)
], ClientTokenType.prototype, "sessionToken", void 0);
ClientTokenType = __decorate([
    ObjectType('tokenType')
], ClientTokenType);
export { ClientTokenType };
let AuthResolver = class AuthResolver {
    constructor(config, url, auth, user, token) {
        this.config = config;
        this.url = url;
        this.auth = auth;
        this.user = user;
        this.token = token;
    }
    currentUser(user) {
        return user;
    }
    async clientToken(currentUser, user) {
        if (user.id !== currentUser.id) {
            throw new ForbiddenException('Invalid user');
        }
        const session = await this.auth.createUserSession(user, undefined, this.config.auth.accessToken.ttl);
        return {
            sessionToken: session.sessionId,
            token: session.sessionId,
            refresh: '',
        };
    }
    async changePassword(user, token, newPassword) {
        const config = await this.config.runtime.fetchAll({
            'auth/password.max': true,
            'auth/password.min': true,
        });
        validators.assertValidPassword(newPassword, {
            min: config['auth/password.min'],
            max: config['auth/password.max'],
        });
        // NOTE: Set & Change password are using the same token type.
        const valid = await this.token.verifyToken(TokenType.ChangePassword, token, {
            credential: user.id,
        });
        if (!valid) {
            throw new ForbiddenException('Invalid token');
        }
        await this.auth.changePassword(user.id, newPassword);
        await this.auth.revokeUserSessions(user.id);
        return user;
    }
    async changeEmail(user, token, email) {
        validators.assertValidEmail(email);
        // @see [sendChangeEmail]
        const valid = await this.token.verifyToken(TokenType.VerifyEmail, token, {
            credential: user.id,
        });
        if (!valid) {
            throw new ForbiddenException('Invalid token');
        }
        email = decodeURIComponent(email);
        await this.auth.changeEmail(user.id, email);
        await this.auth.revokeUserSessions(user.id);
        await this.auth.sendNotificationChangeEmail(email);
        return user;
    }
    async sendChangePasswordEmail(user, callbackUrl, _email) {
        if (!user.emailVerified) {
            throw new ForbiddenException('Please verify your email first.');
        }
        const token = await this.token.createToken(TokenType.ChangePassword, user.id);
        const url = this.url.link(callbackUrl, { token });
        const res = await this.auth.sendChangePasswordEmail(user.email, url);
        return !res.rejected.length;
    }
    async sendSetPasswordEmail(user, callbackUrl, _email) {
        if (!user.emailVerified) {
            throw new ForbiddenException('Please verify your email first.');
        }
        const token = await this.token.createToken(TokenType.ChangePassword, user.id);
        const url = this.url.link(callbackUrl, { token });
        const res = await this.auth.sendSetPasswordEmail(user.email, url);
        return !res.rejected.length;
    }
    // The change email step is:
    // 1. send email to primitive email `sendChangeEmail`
    // 2. user open change email page from email
    // 3. send verify email to new email `sendVerifyChangeEmail`
    // 4. user open confirm email page from new email
    // 5. user click confirm button
    // 6. send notification email
    async sendChangeEmail(user, callbackUrl, _email) {
        if (!user.emailVerified) {
            throw new ForbiddenException('Please verify your email first.');
        }
        const token = await this.token.createToken(TokenType.ChangeEmail, user.id);
        const url = this.url.link(callbackUrl, { token });
        const res = await this.auth.sendChangeEmail(user.email, url);
        return !res.rejected.length;
    }
    async sendVerifyChangeEmail(user, token, email, callbackUrl) {
        validators.assertValidEmail(email);
        const valid = await this.token.verifyToken(TokenType.ChangeEmail, token, {
            credential: user.id,
        });
        if (!valid) {
            throw new ForbiddenException('Invalid token');
        }
        const hasRegistered = await this.user.findUserByEmail(email);
        if (hasRegistered) {
            if (hasRegistered.id !== user.id) {
                throw new BadRequestException(`The email provided has been taken.`);
            }
            else {
                throw new BadRequestException(`The email provided is the same as the current email.`);
            }
        }
        const verifyEmailToken = await this.token.createToken(TokenType.VerifyEmail, user.id);
        const url = this.url.link(callbackUrl, { token: verifyEmailToken, email });
        const res = await this.auth.sendVerifyChangeEmail(email, url);
        return !res.rejected.length;
    }
    async sendVerifyEmail(user, callbackUrl) {
        const token = await this.token.createToken(TokenType.VerifyEmail, user.id);
        const url = this.url.link(callbackUrl, { token });
        const res = await this.auth.sendVerifyEmail(user.email, url);
        return !res.rejected.length;
    }
    async verifyEmail(user, token) {
        if (!token) {
            throw new BadRequestException('Invalid token');
        }
        const valid = await this.token.verifyToken(TokenType.VerifyEmail, token, {
            credential: user.id,
        });
        if (!valid) {
            throw new ForbiddenException('Invalid token');
        }
        const { emailVerifiedAt } = await this.auth.setEmailVerified(user.id);
        return emailVerifiedAt !== null;
    }
};
__decorate([
    SkipThrottle(),
    Public(),
    Query(() => UserType, {
        name: 'currentUser',
        description: 'Get current user',
        nullable: true,
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AuthResolver.prototype, "currentUser", null);
__decorate([
    ResolveField(() => ClientTokenType, {
        name: 'token',
        deprecationReason: 'use [/api/auth/authorize]',
    }),
    __param(0, CurrentUser()),
    __param(1, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UserType]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "clientToken", null);
__decorate([
    Mutation(() => UserType),
    __param(0, CurrentUser()),
    __param(1, Args('token')),
    __param(2, Args('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "changePassword", null);
__decorate([
    Mutation(() => UserType),
    __param(0, CurrentUser()),
    __param(1, Args('token')),
    __param(2, Args('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "changeEmail", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('callbackUrl')),
    __param(2, Args('email', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "sendChangePasswordEmail", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('callbackUrl')),
    __param(2, Args('email', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "sendSetPasswordEmail", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('callbackUrl')),
    __param(2, Args('email', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "sendChangeEmail", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('token')),
    __param(2, Args('email')),
    __param(3, Args('callbackUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "sendVerifyChangeEmail", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('callbackUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "sendVerifyEmail", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "verifyEmail", null);
AuthResolver = __decorate([
    Throttle('strict'),
    Resolver(() => UserType),
    __metadata("design:paramtypes", [Config,
        URLHelper,
        AuthService,
        UserService,
        TokenService])
], AuthResolver);
export { AuthResolver };
//# sourceMappingURL=resolver.js.map