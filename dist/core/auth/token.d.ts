import { PrismaClient } from '@prisma/client';
import { CryptoHelper } from '../../fundamentals/helpers';
export declare enum TokenType {
    SignIn = 0,
    VerifyEmail = 1,
    ChangeEmail = 2,
    ChangePassword = 3,
    Challenge = 4
}
export declare class TokenService {
    private readonly db;
    private readonly crypto;
    constructor(db: PrismaClient, crypto: CryptoHelper);
    createToken(type: TokenType, credential?: string, ttlInSec?: number): Promise<string>;
    verifyToken(type: TokenType, token: string, { credential, keep, }?: {
        credential?: string;
        keep?: boolean;
    }): Promise<{
        token: string;
        type: number;
        credential: string | null;
        expiresAt: Date;
    } | null>;
    cleanExpiredTokens(): Promise<void>;
}
//# sourceMappingURL=token.d.ts.map