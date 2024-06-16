/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import type { EventPayload } from '../../fundamentals';
import { Config } from '../../fundamentals';
import { QuotaService } from '../quota';
export declare class DocHistoryManager {
    private readonly config;
    private readonly db;
    private readonly quota;
    private readonly logger;
    constructor(config: Config, db: PrismaClient, quota: QuotaService);
    onWorkspaceDeleted(workspaceId: EventPayload<'workspace.deleted'>): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    onSnapshotDeleted({ workspaceId, id }: EventPayload<'snapshot.deleted'>): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    onDocUpdated({ workspaceId, id, previous }: EventPayload<'snapshot.updated'>, forceCreate?: boolean): Promise<void>;
    list(workspaceId: string, id: string, before?: Date, take?: number): Promise<{
        timestamp: Date;
    }[]>;
    count(workspaceId: string, id: string): Promise<number>;
    get(workspaceId: string, id: string, timestamp: Date): Promise<{
        workspaceId: string;
        id: string;
        timestamp: Date;
        blob: Buffer;
        state: Buffer | null;
        expiredAt: Date;
    } | null>;
    last(workspaceId: string, id: string): Promise<{
        timestamp: Date;
        state: Buffer | null;
    } | null>;
    recover(workspaceId: string, id: string, timestamp: Date): Promise<Date>;
    getExpiredDateFromNow(workspaceId: string): Promise<Date>;
    cleanupExpiredHistory(): Promise<void>;
}
//# sourceMappingURL=history.d.ts.map