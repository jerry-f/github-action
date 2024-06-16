var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, InternalServerErrorException, } from '@nestjs/common';
import { z } from 'zod';
import { Config, URLHelper } from '../../../fundamentals';
import { OAuthProviderName, } from '../config';
import { AutoRegisteredOAuthProvider } from '../register';
const OIDCTokenSchema = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    refresh_token: z.string(),
    scope: z.string(),
    token_type: z.string(),
});
const OIDCUserInfoSchema = z
    .object({
    sub: z.string(),
    preferred_username: z.string(),
    email: z.string().email(),
    name: z.string(),
    groups: z.array(z.string()).optional(),
})
    .passthrough();
const OIDCConfigurationSchema = z.object({
    authorization_endpoint: z.string().url(),
    token_endpoint: z.string().url(),
    userinfo_endpoint: z.string().url(),
    end_session_endpoint: z.string().url(),
});
class OIDCClient {
    static async fetch(url, options, verifier) {
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status >= 400 && response.status < 500) {
                throw new BadRequestException(`Invalid OIDC configuration`, {
                    cause: await response.json(),
                    description: response.statusText,
                });
            }
            else {
                throw new InternalServerErrorException(`Failed to configure client`, {
                    cause: await response.json(),
                    description: response.statusText,
                });
            }
        }
        const data = await response.json();
        return verifier.parse(data);
    }
    static async create(config, url) {
        const { args, clientId, clientSecret, issuer } = config;
        if (!url.verify(issuer)) {
            throw new Error('OIDC Issuer is invalid.');
        }
        const oidcConfig = await OIDCClient.fetch(`${issuer}/.well-known/openid-configuration`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        }, OIDCConfigurationSchema);
        return new OIDCClient(clientId, clientSecret, args, oidcConfig, url);
    }
    constructor(clientId, clientSecret, args, config, url) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.args = args;
        this.config = config;
        this.url = url;
    }
    authorize(state) {
        const args = Object.assign({}, this.args);
        if ('claim_id' in args)
            delete args.claim_id;
        if ('claim_email' in args)
            delete args.claim_email;
        if ('claim_name' in args)
            delete args.claim_name;
        return `${this.config.authorization_endpoint}?${this.url.stringify({
            client_id: this.clientId,
            redirect_uri: this.url.link('/oauth/callback'),
            response_type: 'code',
            ...args,
            scope: this.args?.scope || 'openid profile email',
            state,
        })}`;
    }
    async token(code) {
        const token = await OIDCClient.fetch(this.config.token_endpoint, {
            method: 'POST',
            body: this.url.stringify({
                code,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.url.link('/oauth/callback'),
                grant_type: 'authorization_code',
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }, OIDCTokenSchema);
        return {
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresAt: new Date(Date.now() + token.expires_in * 1000),
            scope: token.scope,
        };
    }
    mapUserInfo(user, claimsMap) {
        const mappedUser = {};
        for (const [key, value] of Object.entries(claimsMap)) {
            const claimValue = user[value];
            if (claimValue !== undefined) {
                mappedUser[key] = claimValue;
            }
        }
        return mappedUser;
    }
    async userinfo(token) {
        const user = await OIDCClient.fetch(this.config.userinfo_endpoint, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }, OIDCUserInfoSchema);
        const claimsMap = {
            id: this.args?.claim_id || 'preferred_username',
            email: this.args?.claim_email || 'email',
            name: this.args?.claim_name || 'name',
        };
        const userinfo = this.mapUserInfo(user, claimsMap);
        return { id: userinfo.id, email: userinfo.email };
    }
}
let OIDCProvider = class OIDCProvider extends AutoRegisteredOAuthProvider {
    constructor(AFFiNEConfig, url) {
        super();
        this.AFFiNEConfig = AFFiNEConfig;
        this.url = url;
        this.provider = OAuthProviderName.OIDC;
        this.client = null;
    }
    async onModuleInit() {
        const config = this.optionalConfig;
        if (config && config.issuer && config.clientId && config.clientSecret) {
            this.client = await OIDCClient.create(config, this.url);
            super.onModuleInit();
        }
    }
    checkOIDCClient(client) {
        if (!client) {
            throw new Error('OIDC client has not been loaded yet.');
        }
    }
    getAuthUrl(state) {
        this.checkOIDCClient(this.client);
        return this.client.authorize(state);
    }
    async getToken(code) {
        this.checkOIDCClient(this.client);
        return await this.client.token(code);
    }
    async getUser(token) {
        this.checkOIDCClient(this.client);
        return await this.client.userinfo(token);
    }
};
OIDCProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config,
        URLHelper])
], OIDCProvider);
export { OIDCProvider };
//# sourceMappingURL=oidc.js.map