/// <reference types="node" />
import { type BlobInputType, Cache, Config, EventEmitter, type EventPayload, type ListObjectsMetadata, type StorageProvider, StorageProviderFactory } from '../../../fundamentals';
export declare class WorkspaceBlobStorage {
    private readonly config;
    private readonly event;
    private readonly storageFactory;
    private readonly cache;
    readonly provider: StorageProvider;
    constructor(config: Config, event: EventEmitter, storageFactory: StorageProviderFactory, cache: Cache);
    put(workspaceId: string, key: string, blob: BlobInputType): Promise<void>;
    get(workspaceId: string, key: string): Promise<{
        body?: import("stream").Readable | undefined;
        metadata?: import("../../../fundamentals").GetObjectMetadata | undefined;
    }>;
    list(workspaceId: string): Promise<ListObjectsMetadata[]>;
    /**
     * we won't really delete the blobs until the doc blobs manager is implemented sounded
     */
    delete(_workspaceId: string, _key: string): Promise<void>;
    totalSize(workspaceId: string): Promise<number>;
    onWorkspaceDeleted(workspaceId: EventPayload<'workspace.deleted'>): Promise<void>;
    onDeleteWorkspaceBlob({ workspaceId, name, }: EventPayload<'workspace.blob.deleted'>): Promise<void>;
}
//# sourceMappingURL=blob.d.ts.map