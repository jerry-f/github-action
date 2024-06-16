import { Logger } from '@nestjs/common';
import { Config } from '../../fundamentals';
import { UserService } from '../user/service';
import { FeatureService } from './service';
import { FeatureType } from './types';
export declare enum EarlyAccessType {
    App = "app",
    AI = "ai"
}
export declare class FeatureManagementService {
    private readonly feature;
    private readonly user;
    private readonly config;
    protected logger: Logger;
    constructor(feature: FeatureService, user: UserService, config: Config);
    isStaff(email: string): boolean;
    isAdmin(userId: string): Promise<boolean>;
    addAdmin(userId: string): Promise<number>;
    addEarlyAccess(userId: string, type?: EarlyAccessType): Promise<number>;
    removeEarlyAccess(userId: string, type?: EarlyAccessType): Promise<number>;
    listEarlyAccess(type?: EarlyAccessType): Promise<{
        name: string;
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
    }[]>;
    isEarlyAccessUser(userId: string, type?: EarlyAccessType): Promise<boolean>;
    canEarlyAccess(email: string, type?: EarlyAccessType): Promise<boolean>;
    addCopilot(userId: string, reason?: string): Promise<number>;
    removeCopilot(userId: string): Promise<number>;
    isCopilotUser(userId: string): Promise<boolean>;
    getActivatedUserFeatures(userId: string): Promise<FeatureType[]>;
    addWorkspaceFeatures(workspaceId: string, feature: FeatureType, reason?: string): Promise<number>;
    getWorkspaceFeatures(workspaceId: string): Promise<FeatureType[]>;
    hasWorkspaceFeature(workspaceId: string, feature: FeatureType): Promise<boolean>;
    removeWorkspaceFeature(workspaceId: string, feature: FeatureType): Promise<boolean>;
    listFeatureWorkspaces(feature: FeatureType): Promise<import("../workspaces").WorkspaceType[]>;
}
//# sourceMappingURL=management.d.ts.map