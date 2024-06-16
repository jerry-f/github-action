import { SessionCache } from '../../fundamentals';
import { OAuthProviderName } from './config';
import { OAuthProviderFactory } from './register';
interface OAuthState {
    redirectUri: string;
    provider: OAuthProviderName;
}
export declare class OAuthService {
    private readonly providerFactory;
    private readonly cache;
    constructor(providerFactory: OAuthProviderFactory, cache: SessionCache);
    saveOAuthState(state: OAuthState): Promise<`${string}-${string}-${string}-${string}-${string}`>;
    getOAuthState(token: string): Promise<OAuthState | undefined>;
    availableOAuthProviders(): OAuthProviderName[];
}
export {};
//# sourceMappingURL=service.d.ts.map