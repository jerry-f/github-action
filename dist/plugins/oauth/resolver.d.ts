import { OAuthProviderName } from './config';
import { OAuthProviderFactory } from './register';
export declare class OAuthResolver {
    private readonly factory;
    constructor(factory: OAuthProviderFactory);
    oauthProviders(): OAuthProviderName[];
}
//# sourceMappingURL=resolver.d.ts.map