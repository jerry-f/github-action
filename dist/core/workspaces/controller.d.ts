import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { Response } from 'express';
import { CurrentUser } from '../auth';
import { DocHistoryManager, DocManager } from '../doc';
import { WorkspaceBlobStorage } from '../storage';
import { PermissionService } from './permission';
export declare class WorkspacesController {
    private readonly storage;
    private readonly permission;
    private readonly docManager;
    private readonly historyManager;
    private readonly prisma;
    logger: Logger;
    constructor(storage: WorkspaceBlobStorage, permission: PermissionService, docManager: DocManager, historyManager: DocHistoryManager, prisma: PrismaClient);
    blob(user: CurrentUser | undefined, workspaceId: string, name: string, res: Response): Promise<void>;
    doc(user: CurrentUser | undefined, ws: string, guid: string, res: Response): Promise<void>;
    history(user: CurrentUser, ws: string, guid: string, timestamp: string, res: Response): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map