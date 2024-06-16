import { CurrentUser } from '../auth';
import { FeatureManagementService, FeatureType } from '../features';
import { PermissionService } from './permission';
import { WorkspaceType } from './types';
export declare class WorkspaceManagementResolver {
    private readonly feature;
    private readonly permission;
    constructor(feature: FeatureManagementService, permission: PermissionService);
    addWorkspaceFeature(workspaceId: string, feature: FeatureType): Promise<number>;
    removeWorkspaceFeature(workspaceId: string, feature: FeatureType): Promise<boolean>;
    listWorkspaceFeatures(feature: FeatureType): Promise<WorkspaceType[]>;
    setWorkspaceExperimentalFeature(user: CurrentUser, workspaceId: string, feature: FeatureType, enable: boolean): Promise<boolean>;
    availableFeatures(user: CurrentUser): Promise<FeatureType[]>;
    features(workspace: WorkspaceType): Promise<FeatureType[]>;
}
//# sourceMappingURL=management.d.ts.map