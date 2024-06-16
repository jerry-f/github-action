var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Config, URLHelper } from '../../../fundamentals';
import { OAuthProviderName } from '../config';
import { AutoRegisteredOAuthProvider } from '../register';
let GoogleOAuthProvider = class GoogleOAuthProvider extends AutoRegisteredOAuthProvider {
    constructor(AFFiNEConfig, url) {
        super();
        this.AFFiNEConfig = AFFiNEConfig;
        this.url = url;
        this.provider = OAuthProviderName.Google;
    }
    getAuthUrl(state) {
        return `https://accounts.google.com/o/oauth2/v2/auth?${this.url.stringify({
            client_id: this.config.clientId,
            redirect_uri: this.url.link('/oauth/callback'),
            response_type: 'code',
            scope: 'openid email profile',
            prompt: 'select_account',
            access_type: 'offline',
            ...this.config.args,
            state,
        })}`;
    }
    async getToken(code) {
        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                body: this.url.stringify({
                    code,
                    client_id: this.config.clientId,
                    client_secret: this.config.clientSecret,
                    redirect_uri: this.url.link('/oauth/callback'),
                    grant_type: 'authorization_code',
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            if (response.ok) {
                const ghToken = (await response.json());
                return {
                    accessToken: ghToken.access_token,
                    refreshToken: ghToken.refresh_token,
                    expiresAt: new Date(Date.now() + ghToken.expires_in * 1000),
                    scope: ghToken.scope,
                };
            }
            else {
                throw new Error(`Server responded with non-success code ${response.status}, ${JSON.stringify(await response.json())}`);
            }
        }
        catch (e) {
            throw new HttpException(`Failed to get access_token, err: ${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }
    async getUser(token) {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const user = (await response.json());
                return {
                    id: user.id,
                    avatarUrl: user.picture,
                    email: user.email,
                };
            }
            else {
                throw new Error(`Server responded with non-success code ${response.status} ${await response.text()}`);
            }
        }
        catch (e) {
            throw new HttpException(`Failed to get user information, err: ${e.stack}`, HttpStatus.BAD_REQUEST);
        }
    }
};
GoogleOAuthProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config,
        URLHelper])
], GoogleOAuthProvider);
export { GoogleOAuthProvider };
//# sourceMappingURL=google.js.map