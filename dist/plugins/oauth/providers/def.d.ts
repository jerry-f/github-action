import { OAuthProviderName } from '../config';
export interface OAuthAccount {
    id: string;
    email: string;
    avatarUrl?: string;
}
export interface Tokens {
    accessToken: string;
    scope?: string;
    refreshToken?: string;
    expiresAt?: Date;
}
export declare abstract class OAuthProvider {
    abstract provider: OAuthProviderName;
    abstract getAuthUrl(state?: string): string;
    abstract getToken(code: string): Promise<Tokens>;
    abstract getUser(token: string): Promise<OAuthAccount>;
}
//# sourceMappingURL=def.d.ts.map