import { Config, URLHelper } from '../../fundamentals';
import { UserService } from '../user';
import { UserType } from '../user/types';
import { CurrentUser } from './current-user';
import { AuthService } from './service';
import { TokenService } from './token';
export declare class ClientTokenType {
    token: string;
    refresh: string;
    sessionToken?: string;
}
export declare class AuthResolver {
    private readonly config;
    private readonly url;
    private readonly auth;
    private readonly user;
    private readonly token;
    constructor(config: Config, url: URLHelper, auth: AuthService, user: UserService, token: TokenService);
    currentUser(user?: CurrentUser): UserType | undefined;
    clientToken(currentUser: CurrentUser, user: UserType): Promise<ClientTokenType>;
    changePassword(user: CurrentUser, token: string, newPassword: string): Promise<CurrentUser>;
    changeEmail(user: CurrentUser, token: string, email: string): Promise<CurrentUser>;
    sendChangePasswordEmail(user: CurrentUser, callbackUrl: string, _email?: string): Promise<boolean>;
    sendSetPasswordEmail(user: CurrentUser, callbackUrl: string, _email?: string): Promise<boolean>;
    sendChangeEmail(user: CurrentUser, callbackUrl: string, _email?: string): Promise<boolean>;
    sendVerifyChangeEmail(user: CurrentUser, token: string, email: string, callbackUrl: string): Promise<boolean>;
    sendVerifyEmail(user: CurrentUser, callbackUrl: string): Promise<boolean>;
    verifyEmail(user: CurrentUser, token: string): Promise<boolean>;
}
//# sourceMappingURL=resolver.d.ts.map