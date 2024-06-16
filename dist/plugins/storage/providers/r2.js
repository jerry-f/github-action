import assert from 'node:assert';
import { Logger } from '@nestjs/common';
import { S3StorageProvider } from './s3';
export class R2StorageProvider extends S3StorageProvider {
    constructor(config, bucket) {
        assert(config.accountId, 'accountId is required for R2 storage provider');
        super({
            ...config,
            forcePathStyle: true,
            endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        }, bucket);
        this.type = 'cloudflare-r2' /* cast 'r2' to 's3' */;
        this.logger = new Logger(`${R2StorageProvider.name}:${bucket}`);
    }
}
//# sourceMappingURL=r2.js.map