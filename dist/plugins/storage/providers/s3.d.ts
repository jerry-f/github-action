/// <reference types="node" />
import { Readable } from 'node:stream';
import { S3Client } from '@aws-sdk/client-s3';
import { Logger } from '@nestjs/common';
import { BlobInputType, GetObjectMetadata, ListObjectsMetadata, PutObjectMetadata, StorageProvider } from '../../../fundamentals/storage';
import type { S3StorageConfig } from '../config';
export declare class S3StorageProvider implements StorageProvider {
    readonly bucket: string;
    protected logger: Logger;
    protected client: S3Client;
    readonly type = "aws-s3";
    constructor(config: S3StorageConfig, bucket: string);
    put(key: string, body: BlobInputType, metadata?: PutObjectMetadata): Promise<void>;
    get(key: string): Promise<{
        body?: Readable;
        metadata?: GetObjectMetadata;
    }>;
    list(prefix?: string): Promise<ListObjectsMetadata[]>;
    delete(key: string): Promise<void>;
}
//# sourceMappingURL=s3.d.ts.map