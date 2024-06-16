import { OnModuleInit } from '@nestjs/common';
import { Config } from '../../fundamentals';
import { OAuthProviderName } from './config';
import { OAuthProvider } from './providers/def';
export declare function registerOAuthProvider(name: OAuthProviderName, provider: OAuthProvider): void;
export declare class OAuthProviderFactory {
    get providers(): OAuthProviderName[];
    get(name: OAuthProviderName): OAuthProvider | undefined;
}
export declare abstract class AutoRegisteredOAuthProvider extends OAuthProvider implements OnModuleInit {
    protected abstract AFFiNEConfig: Config;
    get optionalConfig(): import("./config").OAuthProviderConfig | import("./config").OAuthOIDCProviderConfig | undefined;
    get config(): import("./config").OAuthProviderConfig | import("./config").OAuthOIDCProviderConfig;
    onModuleInit(): void;
}
//# sourceMappingURL=register.d.ts.map