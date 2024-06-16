/// <reference types="node" />
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Doc } from 'yjs';
import type { EventPayload } from '../../fundamentals';
import { Cache, Config, EventEmitter } from '../../fundamentals';
export declare function isEmptyBuffer(buf: Buffer): boolean;
interface DocResponse {
    doc: Doc;
    timestamp: number;
}
interface BinaryResponse {
    binary: Buffer;
    timestamp: number;
}
/**
 * Since we can't directly save all client updates into database, in which way the database will overload,
 * we need to buffer the updates and merge them to reduce db write.
 *
 * And also, if a new client join, it would be nice to see the latest doc asap,
 * so we need to at least store a snapshot of the doc and return quickly,
 * along side all the updates that have not been applies to that snapshot(timestamp).
 */
export declare class DocManager implements OnModuleInit, OnModuleDestroy {
    private readonly db;
    private readonly config;
    private readonly cache;
    private readonly event;
    private readonly logger;
    private job;
    private readonly seqMap;
    private busy;
    constructor(db: PrismaClient, config: Config, cache: Cache, event: EventEmitter);
    onModuleInit(): void;
    onModuleDestroy(): void;
    private recoverDoc;
    private applyUpdates;
    /**
     * setup pending update processing loop
     */
    setup(): void;
    /**
     * stop pending update processing loop
     */
    destroy(): void;
    onWorkspaceDeleted(workspaceId: string): Promise<void>;
    onSnapshotDeleted({ id, workspaceId, }: EventPayload<'snapshot.deleted'>): Promise<void>;
    /**
     * add update to manager for later processing.
     */
    push(workspaceId: string, guid: string, update: Buffer, retryTimes?: number): Promise<number>;
    batchPush(workspaceId: string, guid: string, updates: Buffer[], retryTimes?: number): Promise<number>;
    /**
     * Get latest timestamp of all docs in the workspace.
     */
    getDocTimestamps(workspaceId: string, after?: number | undefined): Promise<Record<string, number>>;
    /**
     * get the latest doc with all update applied.
     */
    get(workspaceId: string, guid: string): Promise<DocResponse | null>;
    /**
     * get the latest doc binary with all update applied.
     */
    getBinary(workspaceId: string, guid: string): Promise<BinaryResponse | null>;
    /**
     * get the latest doc state vector with all update applied.
     */
    getDocState(workspaceId: string, guid: string): Promise<BinaryResponse | null>;
    /**
     * get the snapshot of the doc we've seen.
     */
    getSnapshot(workspaceId: string, guid: string): Promise<{
        workspaceId: string;
        id: string;
        blob: Buffer;
        seq: number;
        state: Buffer | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    /**
     * get pending updates
     */
    getUpdates(workspaceId: string, guid: string): Promise<{
        workspaceId: string;
        id: string;
        seq: number;
        blob: Buffer;
        createdAt: Date;
    }[]>;
    /**
     * apply pending updates to snapshot
     */
    private autoSquash;
    private getAutoSquashCandidate;
    /**
     * @returns whether the snapshot is updated to the latest, `undefined` means the doc to be upserted is outdated.
     */
    private upsert;
    private _get;
    /**
     * Squash updates into a single update and save it as snapshot,
     * and delete the updates records at the same time.
     */
    private squash;
    private getUpdateSeq;
    private updateCachedUpdatesCount;
    private getAutoSquashCandidateFromCache;
    private doWithLock;
    private lockUpdatesForAutoSquash;
    reportUpdatesQueueCount(): Promise<void>;
}
export {};
//# sourceMappingURL=manager.d.ts.map