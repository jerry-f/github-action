/// <reference types="node" />
import type { BlobInputType, EventPayload, PutObjectMetadata, StorageProvider } from '../../../fundamentals';
import { Config, StorageProviderFactory, URLHelper } from '../../../fundamentals';
export declare class AvatarStorage {
    private readonly config;
    private readonly url;
    private readonly storageFactory;
    readonly provider: StorageProvider;
    private readonly storageConfig;
    constructor(config: Config, url: URLHelper, storageFactory: StorageProviderFactory);
    put(key: string, blob: BlobInputType, metadata?: PutObjectMetadata): Promise<string>;
    get(key: string): Promise<{
        body?: import("stream").Readable | undefined;
        metadata?: import("../../../fundamentals").GetObjectMetadata | undefined;
    }>;
    delete(key: string): Promise<void>;
    onUserDeleted(user: EventPayload<'user.deleted'>): Promise<void>;
}
//# sourceMappingURL=avatar.d.ts.map