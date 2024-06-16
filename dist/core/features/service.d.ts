import { PrismaClient } from '@prisma/client';
import { WorkspaceType } from '../workspaces/types';
import { FeatureConfigType } from './feature';
import { FeatureType } from './types';
export declare class FeatureService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getFeature<F extends FeatureType>(feature: F): Promise<FeatureConfigType<F> | undefined>;
    addUserFeature(userId: string, feature: FeatureType, reason: string, expiredAt?: Date | string): Promise<number>;
    removeUserFeature(userId: string, feature: FeatureType): Promise<number>;
    /**
     * get user's features, will included inactivated features
     * @param userId user id
     * @returns list of features
     */
    getUserFeatures(userId: string): Promise<{
        feature: FeatureConfigType<FeatureType>;
        createdAt: Date;
        activated: boolean;
        reason: string;
        expiredAt: Date | null;
        featureId: number;
    }[]>;
    getActivatedUserFeatures(userId: string): Promise<{
        feature: FeatureConfigType<FeatureType>;
        createdAt: Date;
        activated: boolean;
        reason: string;
        expiredAt: Date | null;
        featureId: number;
    }[]>;
    listFeatureUsers(feature: FeatureType): Promise<{
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
    }[]>;
    hasUserFeature(userId: string, feature: FeatureType): Promise<boolean>;
    addWorkspaceFeature(workspaceId: string, feature: FeatureType, reason: string, expiredAt?: Date | string): Promise<number>;
    removeWorkspaceFeature(workspaceId: string, feature: FeatureType): Promise<number>;
    /**
     * get workspace's features, will included inactivated features
     * @param workspaceId workspace id
     * @returns list of features
     */
    getWorkspaceFeatures(workspaceId: string): Promise<{
        feature: FeatureConfigType<FeatureType>;
        createdAt: Date;
        activated: boolean;
        reason: string;
        expiredAt: Date | null;
        featureId: number;
    }[]>;
    listFeatureWorkspaces(feature: FeatureType): Promise<WorkspaceType[]>;
    hasWorkspaceFeature(workspaceId: string, feature: FeatureType): Promise<boolean>;
}
//# sourceMappingURL=service.d.ts.map