import { Config, URLHelper } from '../../../fundamentals';
import { OAuthProviderName } from '../config';
import { AutoRegisteredOAuthProvider } from '../register';
export interface UserInfo {
    login: string;
    email: string;
    avatar_url: string;
    name: string;
}
export declare class GithubOAuthProvider extends AutoRegisteredOAuthProvider {
    protected readonly AFFiNEConfig: Config;
    private readonly url;
    provider: OAuthProviderName;
    constructor(AFFiNEConfig: Config, url: URLHelper);
    getAuthUrl(state: string): string;
    getToken(code: string): Promise<{
        accessToken: string;
        scope: string;
    }>;
    getUser(token: string): Promise<{
        id: string;
        avatarUrl: string;
        email: string;
    }>;
}
//# sourceMappingURL=github.d.ts.map