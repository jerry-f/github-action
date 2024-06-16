import { ConnectedAccount, PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { AuthService } from '../../core/auth';
import { UserService } from '../../core/user';
import { URLHelper } from '../../fundamentals';
import { OAuthProviderName } from './config';
import { OAuthAccount, Tokens } from './providers/def';
import { OAuthProviderFactory } from './register';
import { OAuthService } from './service';
export declare class OAuthController {
    private readonly auth;
    private readonly oauth;
    private readonly user;
    private readonly providerFactory;
    private readonly url;
    private readonly db;
    constructor(auth: AuthService, oauth: OAuthService, user: UserService, providerFactory: OAuthProviderFactory, url: URLHelper, db: PrismaClient);
    login(res: Response, unknownProviderName: string, redirectUri?: string): Promise<void>;
    callback(req: Request, res: Response, code?: string, stateStr?: string): Promise<void>;
    private loginFromOauth;
    updateConnectedAccount(connectedUser: ConnectedAccount, tokens: Tokens): import(".prisma/client").Prisma.Prisma__ConnectedAccountClient<{
        id: string;
        userId: string;
        provider: string;
        providerAccountId: string;
        scope: string | null;
        accessToken: string | null;
        refreshToken: string | null;
        expiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createUserWithConnectedAccount(provider: OAuthProviderName, externalAccount: OAuthAccount, tokens: Tokens): Promise<{
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        registered: boolean;
    }>;
    private connectAccountFromOauth;
}
//# sourceMappingURL=controller.d.ts.map