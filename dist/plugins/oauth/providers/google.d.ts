import { Config, URLHelper } from '../../../fundamentals';
import { OAuthProviderName } from '../config';
import { AutoRegisteredOAuthProvider } from '../register';
export interface UserInfo {
    id: string;
    email: string;
    picture: string;
    name: string;
}
export declare class GoogleOAuthProvider extends AutoRegisteredOAuthProvider {
    protected readonly AFFiNEConfig: Config;
    private readonly url;
    provider: OAuthProviderName;
    constructor(AFFiNEConfig: Config, url: URLHelper);
    getAuthUrl(state: string): string;
    getToken(code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
        scope: string;
    }>;
    getUser(token: string): Promise<{
        id: string;
        avatarUrl: string;
        email: string;
    }>;
}
//# sourceMappingURL=google.d.ts.map