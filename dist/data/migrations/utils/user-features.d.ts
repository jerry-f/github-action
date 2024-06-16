import { PrismaClient } from '@prisma/client';
import { CommonFeature, FeatureType } from '../../../core/features';
export declare function upsertFeature(db: PrismaClient, feature: CommonFeature): Promise<void>;
export declare function upsertLatestFeatureVersion(db: PrismaClient, type: FeatureType): Promise<void>;
export declare function migrateNewFeatureTable(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=user-features.d.ts.map