import { OnModuleInit } from '@nestjs/common';
import { Config, URLHelper } from '../../../fundamentals';
import { OAuthProviderName } from '../config';
import { AutoRegisteredOAuthProvider } from '../register';
import { OAuthAccount, Tokens } from './def';
export declare class OIDCProvider extends AutoRegisteredOAuthProvider implements OnModuleInit {
    protected readonly AFFiNEConfig: Config;
    private readonly url;
    provider: OAuthProviderName;
    private client;
    constructor(AFFiNEConfig: Config, url: URLHelper);
    onModuleInit(): Promise<void>;
    private checkOIDCClient;
    getAuthUrl(state: string): string;
    getToken(code: string): Promise<Tokens>;
    getUser(token: string): Promise<OAuthAccount>;
}
//# sourceMappingURL=oidc.d.ts.map