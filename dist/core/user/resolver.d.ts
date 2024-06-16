import { PrismaClient } from '@prisma/client';
import { Config, CryptoHelper, type FileUpload } from '../../fundamentals';
import { CurrentUser } from '../auth/current-user';
import { AvatarStorage } from '../storage';
import { UserService } from './service';
import { DeleteAccount, UpdateUserInput, UserOrLimitedUser, UserType } from './types';
export declare class UserResolver {
    private readonly prisma;
    private readonly storage;
    private readonly users;
    constructor(prisma: PrismaClient, storage: AvatarStorage, users: UserService);
    user(email: string, currentUser?: CurrentUser): Promise<typeof UserOrLimitedUser | null>;
    invoiceCount(user: CurrentUser): Promise<number>;
    uploadAvatar(user: CurrentUser, avatar: FileUpload): Promise<{
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
    updateUserProfile(user: CurrentUser, input: UpdateUserInput): Promise<UserType>;
    removeAvatar(user: CurrentUser): Promise<{
        success: boolean;
    }>;
    deleteAccount(user: CurrentUser): Promise<DeleteAccount>;
}
declare class ListUserInput {
    skip: number;
    first: number;
}
declare class CreateUserInput {
    email: string;
    name: string | null;
    password: string | null;
}
export declare class UserManagementResolver {
    private readonly db;
    private readonly user;
    private readonly crypto;
    private readonly config;
    constructor(db: PrismaClient, user: UserService, crypto: CryptoHelper, config: Config);
    users(input: ListUserInput): Promise<UserType[]>;
    getUser(id: string): Promise<CurrentUser | null>;
    createUser(input: CreateUserInput): Promise<CurrentUser | null>;
    deleteUser(id: string): Promise<DeleteAccount>;
}
export {};
//# sourceMappingURL=resolver.d.ts.map