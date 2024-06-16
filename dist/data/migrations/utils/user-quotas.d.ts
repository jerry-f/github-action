import { PrismaClient } from '@prisma/client';
import { Quota, QuotaType } from '../../../core/quota/types';
export declare function upgradeQuotaVersion(db: PrismaClient, quota: Quota, reason: string): Promise<void>;
export declare function upsertLatestQuotaVersion(db: PrismaClient, type: QuotaType): Promise<void>;
export declare function upgradeLatestQuotaVersion(db: PrismaClient, type: QuotaType, reason: string): Promise<void>;
//# sourceMappingURL=user-quotas.d.ts.map