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
let GithubOAuthProvider = class GithubOAuthProvider extends AutoRegisteredOAuthProvider {
    constructor(AFFiNEConfig, url) {
        super();
        this.AFFiNEConfig = AFFiNEConfig;
        this.url = url;
        this.provider = OAuthProviderName.GitHub;
    }
    getAuthUrl(state) {
        return `https://github.com/login/oauth/authorize?${this.url.stringify({
            client_id: this.config.clientId,
            redirect_uri: this.url.link('/oauth/callback'),
            scope: 'user',
            ...this.config.args,
            state,
        })}`;
    }
    async getToken(code) {
        try {
            const response = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                body: this.url.stringify({
                    code,
                    client_id: this.config.clientId,
                    client_secret: this.config.clientSecret,
                    redirect_uri: this.url.link('/oauth/callback'),
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
            const response = await fetch('https://api.github.com/user', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const user = (await response.json());
                return {
                    id: user.login,
                    avatarUrl: user.avatar_url,
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
GithubOAuthProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config,
        URLHelper])
], GithubOAuthProvider);
export { GithubOAuthProvider };
//# sourceMappingURL=github.js.map