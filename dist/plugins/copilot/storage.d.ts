/// <reference types="node" />
/// <reference types="node" />
import { QuotaManagementService } from '../../core/quota';
import { type BlobInputType, Config, type FileUpload, type StorageProvider, StorageProviderFactory, URLHelper } from '../../fundamentals';
export declare class CopilotStorage {
    private readonly config;
    private readonly url;
    private readonly storageFactory;
    private readonly quota;
    readonly provider: StorageProvider;
    constructor(config: Config, url: URLHelper, storageFactory: StorageProviderFactory, quota: QuotaManagementService);
    put(userId: string, workspaceId: string, key: string, blob: BlobInputType): Promise<string>;
    get(userId: string, workspaceId: string, key: string): Promise<{
        body?: import("stream").Readable | undefined;
        metadata?: import("../../fundamentals").GetObjectMetadata | undefined;
    }>;
    delete(userId: string, workspaceId: string, key: string): Promise<void>;
    handleUpload(userId: string, blob: FileUpload): Promise<{
        buffer: Buffer;
        filename: string;
    }>;
    handleRemoteLink(userId: string, workspaceId: string, link: string): Promise<string>;
}
//# sourceMappingURL=storage.d.ts.map