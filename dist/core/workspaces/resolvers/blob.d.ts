import { Logger } from '@nestjs/common';
import type { FileUpload } from '../../../fundamentals';
import { CurrentUser } from '../../auth';
import { QuotaManagementService } from '../../quota';
import { WorkspaceBlobStorage } from '../../storage';
import { PermissionService } from '../permission';
import { WorkspaceType } from '../types';
export declare class WorkspaceBlobResolver {
    private readonly permissions;
    private readonly quota;
    private readonly storage;
    logger: Logger;
    constructor(permissions: PermissionService, quota: QuotaManagementService, storage: WorkspaceBlobStorage);
    blobs(user: CurrentUser, workspace: WorkspaceType): Promise<string[]>;
    blobsSize(workspace: WorkspaceType): Promise<number>;
    /**
     * @deprecated use `workspace.blobs` instead
     */
    listBlobs(user: CurrentUser, workspaceId: string): Promise<string[]>;
    /**
     * @deprecated use `user.storageUsage` instead
     */
    collectAllBlobSizes(user: CurrentUser): Promise<{
        size: number;
    }>;
    /**
     * @deprecated mutation `setBlob` will check blob limit & quota usage
     */
    checkBlobSize(user: CurrentUser, workspaceId: string, blobSize: number): Promise<false | {
        size: number;
    }>;
    setBlob(user: CurrentUser, workspaceId: string, blob: FileUpload): Promise<string>;
    deleteBlob(user: CurrentUser, workspaceId: string, name: string): Promise<boolean>;
}
//# sourceMappingURL=blob.d.ts.map