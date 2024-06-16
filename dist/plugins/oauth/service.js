var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { SessionCache } from '../../fundamentals';
import { OAuthProviderFactory } from './register';
const OAUTH_STATE_KEY = 'OAUTH_STATE';
let OAuthService = class OAuthService {
    constructor(providerFactory, cache) {
        this.providerFactory = providerFactory;
        this.cache = cache;
    }
    async saveOAuthState(state) {
        const token = randomUUID();
        await this.cache.set(`${OAUTH_STATE_KEY}:${token}`, state, {
            ttl: 3600 * 3 * 1000 /* 3 hours */,
        });
        return token;
    }
    async getOAuthState(token) {
        return this.cache.get(`${OAUTH_STATE_KEY}:${token}`);
    }
    availableOAuthProviders() {
        return this.providerFactory.providers;
    }
};
OAuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [OAuthProviderFactory,
        SessionCache])
], OAuthService);
export { OAuthService };
//# sourceMappingURL=service.js.map