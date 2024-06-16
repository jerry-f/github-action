import { Logger } from '@nestjs/common';
import { FeatureService } from '../features';
import { WorkspaceBlobStorage } from '../storage';
import { PermissionService } from '../workspaces/permission';
import { QuotaService } from './service';
import { QuotaQueryType } from './types';
type QuotaBusinessType = QuotaQueryType & {
    businessBlobLimit: number;
    unlimited: boolean;
};
export declare class QuotaManagementService {
    private readonly feature;
    private readonly quota;
    private readonly permissions;
    private readonly storage;
    protected logger: Logger;
    constructor(feature: FeatureService, quota: QuotaService, permissions: PermissionService, storage: WorkspaceBlobStorage);
    getUserQuota(userId: string): Promise<{
        name: import("./types").QuotaType;
        reason: string;
        createAt: Date;
        expiredAt: Date | null;
        blobLimit: number;
        businessBlobLimit: number;
        storageQuota: number;
        historyPeriod: number;
        memberLimit: number;
        copilotActionLimit: number | undefined;
    }>;
    getUserUsage(userId: string): Promise<number>;
    private generateQuotaCalculator;
    getQuotaCalculator(userId: string): Promise<(recvSize: number) => boolean>;
    getQuotaCalculatorByWorkspace(workspaceId: string): Promise<(recvSize: number) => boolean>;
    getWorkspaceUsage(workspaceId: string): Promise<QuotaBusinessType>;
    private mergeUnlimitedQuota;
    checkBlobQuota(workspaceId: string, size: number): Promise<number>;
}
export {};
//# sourceMappingURL=storage.d.ts.map