var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import './config';
import { AuthModule } from '../../core/auth';
import { ServerFeature } from '../../core/config';
import { UserModule } from '../../core/user';
import { Plugin } from '../registry';
import { OAuthController } from './controller';
import { OAuthProviders } from './providers';
import { OAuthProviderFactory } from './register';
import { OAuthResolver } from './resolver';
import { OAuthService } from './service';
let OAuthModule = class OAuthModule {
};
OAuthModule = __decorate([
    Plugin({
        name: 'oauth',
        imports: [AuthModule, UserModule],
        providers: [
            OAuthProviderFactory,
            OAuthService,
            OAuthResolver,
            ...OAuthProviders,
        ],
        controllers: [OAuthController],
        contributesTo: ServerFeature.OAuth,
        if: config => !!config.plugins.oauth,
    })
], OAuthModule);
export { OAuthModule };
//# sourceMappingURL=index.js.map