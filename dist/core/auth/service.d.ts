import { OnApplicationBootstrap } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import type { CookieOptions, Request, Response } from 'express';
import { Config, CryptoHelper, MailService } from '../../fundamentals';
import { FeatureManagementService } from '../features/management';
import { QuotaService } from '../quota/service';
import { UserService } from '../user/service';
import type { CurrentUser } from './current-user';
export declare function parseAuthUserSeqNum(value: any): number;
export declare function sessionUser(user: Pick<User, 'id' | 'email' | 'avatarUrl' | 'name' | 'emailVerifiedAt'> & {
    password?: string | null;
}): CurrentUser;
export declare class AuthService implements OnApplicationBootstrap {
    private readonly config;
    private readonly db;
    private readonly mailer;
    private readonly feature;
    private readonly quota;
    private readonly user;
    private readonly crypto;
    readonly cookieOptions: CookieOptions;
    static readonly sessionCookieName = "affine_session";
    static readonly authUserSeqHeaderName = "x-auth-user";
    constructor(config: Config, db: PrismaClient, mailer: MailService, feature: FeatureManagementService, quota: QuotaService, user: UserService, crypto: CryptoHelper);
    onApplicationBootstrap(): Promise<void>;
    canSignIn(email: string): Promise<boolean>;
    signUp(name: string, email: string, password: string): Promise<CurrentUser>;
    signIn(email: string, password: string): Promise<CurrentUser>;
    getUser(token: string, seq?: number): Promise<{
        user: CurrentUser | null;
        expiresAt: Date | null;
    }>;
    getUserList(token: string): Promise<CurrentUser[]>;
    signOut(token: string, seq?: number): Promise<({
        userSessions: {
            id: string;
            sessionId: string;
            userId: string;
            expiresAt: Date | null;
            createdAt: Date;
        }[];
    } & {
        id: string;
        expiresAt: Date | null;
        createdAt: Date;
    }) | null>;
    getSession(token: string): Promise<({
        userSessions: {
            id: string;
            sessionId: string;
            userId: string;
            expiresAt: Date | null;
            createdAt: Date;
        }[];
    } & {
        id: string;
        expiresAt: Date | null;
        createdAt: Date;
    }) | null>;
    refreshUserSessionIfNeeded(_req: Request, res: Response, sessionId: string, userId: string, expiresAt: Date, ttr?: number): Promise<boolean>;
    createUserSession(user: {
        id: string;
    }, existingSession?: string, ttl?: number): Promise<{
        id: string;
        sessionId: string;
        userId: string;
        expiresAt: Date | null;
        createdAt: Date;
    }>;
    revokeUserSessions(userId: string, sessionId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    setCookie(_req: Request, res: Response, user: {
        id: string;
    }): Promise<void>;
    changePassword(id: string, newPassword: string): Promise<Omit<User, 'password'>>;
    changeEmail(id: string, newEmail: string): Promise<Omit<User, 'password'>>;
    setEmailVerified(id: string): Promise<{
        password: string | null;
        subscriptions: {
            id: number;
            userId: string;
            plan: string;
            recurring: string;
            stripeSubscriptionId: string;
            status: string;
            start: Date;
            end: Date;
            nextBillAt: Date | null;
            canceledAt: Date | null;
            trialStart: Date | null;
            trialEnd: Date | null;
            stripeScheduleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        registered: boolean;
        features: {
            id: number;
            userId: string;
            featureId: number;
            reason: string;
            createdAt: Date;
            expiredAt: Date | null;
            activated: boolean;
        }[];
        customer: {
            userId: string;
            stripeCustomerId: string;
            createdAt: Date;
        } | null;
        invoices: {
            id: number;
            userId: string;
            stripeInvoiceId: string;
            currency: string;
            amount: number;
            status: string;
            plan: string;
            recurring: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string;
            lastPaymentError: string | null;
            link: string | null;
        }[];
        workspacePermissions: {
            id: string;
            workspaceId: string;
            userId: string;
            type: number;
            accepted: boolean;
            createdAt: Date;
        }[];
        pagePermissions: {
            id: string;
            workspaceId: string;
            pageId: string;
            userId: string;
            type: number;
            accepted: boolean;
            createdAt: Date;
        }[];
        connectedAccounts: {
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
        }[];
        sessions: {
            id: string;
            sessionId: string;
            userId: string;
            expiresAt: Date | null;
            createdAt: Date;
        }[];
        aiSessions: {
            id: string;
            userId: string;
            workspaceId: string;
            docId: string;
            promptName: string;
            messageCost: number;
            tokenCost: number;
            createdAt: Date;
            deletedAt: Date | null;
        }[];
        updatedRuntimeConfigs: {
            id: string;
            type: import(".prisma/client").$Enums.RuntimeConfigType;
            module: string;
            key: string;
            value: import(".prisma/client").Prisma.JsonValue;
            description: string;
            updatedAt: Date;
            deletedAt: Date | null;
            lastUpdatedBy: string | null;
        }[];
        _count: {
            features: number;
            customer: number;
            subscriptions: number;
            invoices: number;
            workspacePermissions: number;
            pagePermissions: number;
            connectedAccounts: number;
            sessions: number;
            aiSessions: number;
            updatedRuntimeConfigs: number;
        };
    }>;
    sendChangePasswordEmail(email: string, callbackUrl: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendSetPasswordEmail(email: string, callbackUrl: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendChangeEmail(email: string, callbackUrl: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendVerifyChangeEmail(email: string, callbackUrl: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendVerifyEmail(email: string, callbackUrl: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendNotificationChangeEmail(email: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    sendSignInEmail(email: string, link: string, signUp: boolean): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    cleanExpiredSessions(): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map