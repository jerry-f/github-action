import type { Request, Response } from 'express';
import { Config, URLHelper } from '../../fundamentals';
import { UserService } from '../user';
import { CurrentUser } from './current-user';
import { AuthService } from './service';
import { TokenService } from './token';
declare class SignInCredential {
    email: string;
    password?: string;
}
declare class MagicLinkCredential {
    email: string;
    token: string;
}
export declare class AuthController {
    private readonly url;
    private readonly auth;
    private readonly user;
    private readonly token;
    private readonly config;
    constructor(url: URLHelper, auth: AuthService, user: UserService, token: TokenService, config: Config);
    signIn(req: Request, res: Response, credential: SignInCredential, redirectUri?: string): Promise<void>;
    sendSignInEmail({ email, signUp }: {
        email: string;
        signUp: boolean;
    }, redirectUri: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    signOut(req: Request, res: Response, redirectUri?: string): Promise<void | Response<any, Record<string, any>>>;
    magicLinkSignIn(req: Request, res: Response, { email, token }: MagicLinkCredential): Promise<void>;
    currentSessionUser(user?: CurrentUser): Promise<{
        user: CurrentUser | undefined;
    }>;
    currentSessionUsers(req: Request): Promise<{
        users: CurrentUser[];
    }>;
    challenge(): Promise<{
        challenge: `${string}-${string}-${string}-${string}-${string}`;
        resource: `${string}-${string}-${string}-${string}-${string}`;
    }>;
}
export {};
//# sourceMappingURL=controller.d.ts.map