import type { R2StorageConfig } from '../config';
import { S3StorageProvider } from './s3';
export declare class R2StorageProvider extends S3StorageProvider {
    readonly type: any;
    constructor(config: R2StorageConfig, bucket: string);
}
//# sourceMappingURL=r2.d.ts.map