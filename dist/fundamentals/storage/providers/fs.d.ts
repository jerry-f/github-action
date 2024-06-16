/// <reference types="node" />
import { Readable } from 'node:stream';
import { FsStorageConfig } from '../config';
import { BlobInputType, GetObjectMetadata, ListObjectsMetadata, PutObjectMetadata, StorageProvider } from './provider';
export declare class FsStorageProvider implements StorageProvider {
    readonly bucket: string;
    private readonly path;
    private readonly logger;
    readonly type = "fs";
    constructor(config: FsStorageConfig, bucket: string);
    put(key: string, body: BlobInputType, metadata?: PutObjectMetadata): Promise<void>;
    get(key: string): Promise<{
        body?: Readable;
        metadata?: GetObjectMetadata;
    }>;
    list(prefix?: string): Promise<ListObjectsMetadata[]>;
    delete(key: string): Promise<void>;
    ensureAvailability(): void;
    private join;
    private readObject;
    private writeObject;
    private writeMetadata;
    private readMetadata;
}
//# sourceMappingURL=fs.d.ts.map