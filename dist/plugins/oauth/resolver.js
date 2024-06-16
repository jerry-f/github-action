var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { registerEnumType, ResolveField, Resolver } from '@nestjs/graphql';
import { ServerConfigType } from '../../core/config';
import { OAuthProviderName } from './config';
import { OAuthProviderFactory } from './register';
registerEnumType(OAuthProviderName, { name: 'OAuthProviderType' });
let OAuthResolver = class OAuthResolver {
    constructor(factory) {
        this.factory = factory;
    }
    oauthProviders() {
        return this.factory.providers;
    }
};
__decorate([
    ResolveField(() => [OAuthProviderName]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OAuthResolver.prototype, "oauthProviders", null);
OAuthResolver = __decorate([
    Resolver(() => ServerConfigType),
    __metadata("design:paramtypes", [OAuthProviderFactory])
], OAuthResolver);
export { OAuthResolver };
//# sourceMappingURL=resolver.js.map