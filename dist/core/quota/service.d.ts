import { PrismaClient } from '@prisma/client';
import type { EventPayload } from '../../fundamentals';
import { PrismaTransaction } from '../../fundamentals';
import { FeatureManagementService } from '../features/management';
import { QuotaConfig } from './quota';
import { QuotaType } from './types';
export declare class QuotaService {
    private readonly prisma;
    private readonly feature;
    constructor(prisma: PrismaClient, feature: FeatureManagementService);
    getUserQuota(userId: string): Promise<{
        feature: QuotaConfig;
        createdAt: Date;
        reason: string;
        expiredAt: Date | null;
        featureId: number;
    }>;
    getUserQuotas(userId: string): Promise<{
        feature: QuotaConfig;
        createdAt: Date;
        activated: boolean;
        reason: string;
        expiredAt: Date | null;
        featureId: number;
    }[]>;
    switchUserQuota(userId: string, quota: QuotaType, reason?: string, expiredAt?: Date): Promise<void>;
    hasQuota(userId: string, quota: QuotaType, tx?: PrismaTransaction): Promise<boolean>;
    onSubscriptionUpdated({ userId, plan, }: EventPayload<'user.subscription.activated'>): Promise<void>;
    onSubscriptionCanceled({ userId, plan, }: EventPayload<'user.subscription.canceled'>): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map