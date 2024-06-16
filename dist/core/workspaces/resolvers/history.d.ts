import type { SnapshotHistory } from '@prisma/client';
import { CurrentUser } from '../../auth';
import { DocHistoryManager } from '../../doc';
import { PermissionService } from '../permission';
import { WorkspaceType } from '../types';
declare class DocHistoryType implements Partial<SnapshotHistory> {
    workspaceId: string;
    id: string;
    timestamp: Date;
}
export declare class DocHistoryResolver {
    private readonly historyManager;
    private readonly permission;
    constructor(historyManager: DocHistoryManager, permission: PermissionService);
    histories(workspace: WorkspaceType, guid: string, timestamp?: Date, take?: number): Promise<DocHistoryType[]>;
    recoverDoc(user: CurrentUser, workspaceId: string, guid: string, timestamp: Date): Promise<Date>;
}
export {};
//# sourceMappingURL=history.d.ts.map