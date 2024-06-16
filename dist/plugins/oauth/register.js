var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, Logger } from '@nestjs/common';
import { OAuthProvider } from './providers/def';
const PROVIDERS = new Map();
export function registerOAuthProvider(name, provider) {
    PROVIDERS.set(name, provider);
}
let OAuthProviderFactory = class OAuthProviderFactory {
    get providers() {
        return Array.from(PROVIDERS.keys());
    }
    get(name) {
        return PROVIDERS.get(name);
    }
};
OAuthProviderFactory = __decorate([
    Injectable()
], OAuthProviderFactory);
export { OAuthProviderFactory };
export class AutoRegisteredOAuthProvider extends OAuthProvider {
    get optionalConfig() {
        return this.AFFiNEConfig.plugins.oauth?.providers?.[this.provider];
    }
    get config() {
        const config = this.optionalConfig;
        if (!config) {
            throw new Error(`OAuthProvider Config should not be used before registered`);
        }
        return config;
    }
    onModuleInit() {
        const config = this.optionalConfig;
        if (config && config.clientId && config.clientSecret) {
            registerOAuthProvider(this.provider, this);
            new Logger(`OAuthProvider:${this.provider}`).log('OAuth provider registered.');
        }
    }
}
//# sourceMappingURL=register.js.map