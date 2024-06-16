import { Prisma, PrismaClient } from '@prisma/client';
import { Config, EventEmitter, type EventPayload } from '../../fundamentals';
export declare class UserService {
    private readonly config;
    private readonly prisma;
    private readonly emitter;
    private readonly logger;
    defaultUserSelect: {
        id: true;
        name: true;
        email: true;
        emailVerifiedAt: true;
        avatarUrl: true;
        registered: true;
        createdAt: true;
    };
    constructor(config: Config, prisma: PrismaClient, emitter: EventEmitter);
    get userCreatingData(): {
        name: string;
        features: {
            create: {
                reason: string;
                activated: boolean;
                feature: {
                    connect: {
                        feature_version: {
                            feature: import("../quota").QuotaType;
                            version: number;
                        };
                    };
                };
            };
        };
    };
    createUser(data: Prisma.UserCreateInput): Promise<{
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        registered: boolean;
    }>;
    createAnonymousUser(email: string, data?: Partial<Prisma.UserCreateInput>): Promise<{
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        registered: boolean;
    }>;
    findUserById(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        registered: boolean;
    } | null>;
    findUserByEmail(email: string): Promise<{
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        registered: boolean;
    } | null>;
    /**
     * supposed to be used only for `Credential SignIn`
     */
    findUserWithHashedPasswordByEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        password: string | null;
        registered: boolean;
    } | null>;
    findOrCreateUser(email: string, data?: Partial<Prisma.UserCreateInput>): Promise<{
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        registered: boolean;
    }>;
    fulfillUser(email: string, data: Partial<Pick<Prisma.UserCreateInput, 'emailVerifiedAt' | 'registered'>>): Promise<{
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        registered: boolean;
    }>;
    updateUser(id: string, data: Prisma.UserUpdateInput, select?: Prisma.UserSelect): Promise<{
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
            value: Prisma.JsonValue;
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
    deleteUser(id: string): Promise<void>;
    onUserUpdated(user: EventPayload<'user.deleted'>): Promise<void>;
    onUserDeleted(user: EventPayload<'user.deleted'>): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map