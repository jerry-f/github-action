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
import { BadRequestException, Controller, Get, Query, Req, Res, } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthService, Public } from '../../core/auth';
import { UserService } from '../../core/user';
import { URLHelper } from '../../fundamentals';
import { OAuthProviderName } from './config';
import { OAuthProviderFactory } from './register';
import { OAuthService } from './service';
let OAuthController = class OAuthController {
    constructor(auth, oauth, user, providerFactory, url, db) {
        this.auth = auth;
        this.oauth = oauth;
        this.user = user;
        this.providerFactory = providerFactory;
        this.url = url;
        this.db = db;
    }
    async login(res, unknownProviderName, redirectUri) {
        // @ts-expect-error safe
        const providerName = OAuthProviderName[unknownProviderName];
        const provider = this.providerFactory.get(providerName);
        if (!provider) {
            throw new BadRequestException('Invalid OAuth provider');
        }
        const state = await this.oauth.saveOAuthState({
            redirectUri: redirectUri ?? this.url.home,
            provider: providerName,
        });
        return res.redirect(provider.getAuthUrl(state));
    }
    async callback(req, res, code, stateStr) {
        if (!code) {
            throw new BadRequestException('Missing query parameter `code`');
        }
        if (!stateStr) {
            throw new BadRequestException('Invalid callback state parameter');
        }
        const state = await this.oauth.getOAuthState(stateStr);
        if (!state) {
            throw new BadRequestException('OAuth state expired, please try again.');
        }
        if (!state.provider) {
            throw new BadRequestException('Missing callback state parameter `provider`');
        }
        const provider = this.providerFactory.get(state.provider);
        if (!provider) {
            throw new BadRequestException('Invalid provider');
        }
        const tokens = await provider.getToken(code);
        const externAccount = await provider.getUser(tokens.accessToken);
        const user = req.user;
        try {
            if (!user) {
                // if user not found, login
                const user = await this.loginFromOauth(state.provider, externAccount, tokens);
                const session = await this.auth.createUserSession(user, req.cookies[AuthService.sessionCookieName]);
                res.cookie(AuthService.sessionCookieName, session.sessionId, {
                    expires: session.expiresAt ?? void 0, // expiredAt is `string | null`
                    ...this.auth.cookieOptions,
                });
            }
            else {
                // if user is found, connect the account to this user
                await this.connectAccountFromOauth(user, state.provider, externAccount, tokens);
            }
        }
        catch (e) {
            return res.redirect(this.url.link('/signIn', {
                redirect_uri: state.redirectUri,
                error: e.message,
            }));
        }
        this.url.safeRedirect(res, state.redirectUri);
    }
    async loginFromOauth(provider, externalAccount, tokens) {
        const connectedUser = await this.db.connectedAccount.findFirst({
            where: {
                provider,
                providerAccountId: externalAccount.id,
            },
            include: {
                user: true,
            },
        });
        if (connectedUser) {
            // already connected
            await this.updateConnectedAccount(connectedUser, tokens);
            return connectedUser.user;
        }
        let user = await this.user.findUserByEmail(externalAccount.email);
        if (user) {
            // we can't directly connect the external account with given email in sign in scenario for safety concern.
            // let user manually connect in account sessions instead.
            if (user.registered) {
                throw new BadRequestException('The account with provided email is not register in the same way.');
            }
            await this.user.fulfillUser(externalAccount.email, {
                emailVerifiedAt: new Date(),
                registered: true,
            });
            await this.db.connectedAccount.create({
                data: {
                    userId: user.id,
                    provider,
                    providerAccountId: externalAccount.id,
                    ...tokens,
                },
            });
            return user;
        }
        else {
            user = await this.createUserWithConnectedAccount(provider, externalAccount, tokens);
        }
        return user;
    }
    updateConnectedAccount(connectedUser, tokens) {
        return this.db.connectedAccount.update({
            where: {
                id: connectedUser.id,
            },
            data: tokens,
        });
    }
    async createUserWithConnectedAccount(provider, externalAccount, tokens) {
        return this.user.createUser({
            email: externalAccount.email,
            name: externalAccount.email.split('@')[0],
            avatarUrl: externalAccount.avatarUrl,
            emailVerifiedAt: new Date(),
            connectedAccounts: {
                create: {
                    provider,
                    providerAccountId: externalAccount.id,
                    ...tokens,
                },
            },
        });
    }
    async connectAccountFromOauth(user, provider, externalAccount, tokens) {
        const connectedUser = await this.db.connectedAccount.findFirst({
            where: {
                provider,
                providerAccountId: externalAccount.id,
            },
        });
        if (connectedUser) {
            if (connectedUser.id !== user.id) {
                throw new BadRequestException('The third-party account has already been connected to another user.');
            }
        }
        else {
            await this.db.connectedAccount.create({
                data: {
                    userId: user.id,
                    provider,
                    providerAccountId: externalAccount.id,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
            });
        }
    }
};
__decorate([
    Public(),
    Get('/login'),
    __param(0, Res()),
    __param(1, Query('provider')),
    __param(2, Query('redirect_uri')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "login", null);
__decorate([
    Public(),
    Get('/callback'),
    __param(0, Req()),
    __param(1, Res()),
    __param(2, Query('code')),
    __param(3, Query('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "callback", null);
OAuthController = __decorate([
    Controller('/oauth'),
    __metadata("design:paramtypes", [AuthService,
        OAuthService,
        UserService,
        OAuthProviderFactory,
        URLHelper,
        PrismaClient])
], OAuthController);
export { OAuthController };
//# sourceMappingURL=controller.js.map