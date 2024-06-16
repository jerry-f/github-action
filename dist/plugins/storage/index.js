var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import './config';
import { registerStorageProvider } from '../../fundamentals/storage';
import { Plugin } from '../registry';
import { R2StorageProvider } from './providers/r2';
import { S3StorageProvider } from './providers/s3';
registerStorageProvider('cloudflare-r2', (config, bucket) => {
    if (!config.plugins['cloudflare-r2']) {
        throw new Error('Missing cloudflare-r2 storage provider configuration');
    }
    return new R2StorageProvider(config.plugins['cloudflare-r2'], bucket);
});
registerStorageProvider('aws-s3', (config, bucket) => {
    if (!config.plugins['aws-s3']) {
        throw new Error('Missing aws-s3 storage provider configuration');
    }
    return new S3StorageProvider(config.plugins['aws-s3'], bucket);
});
let CloudflareR2Module = class CloudflareR2Module {
};
CloudflareR2Module = __decorate([
    Plugin({
        name: 'cloudflare-r2',
        requires: [
            'plugins.cloudflare-r2.accountId',
            'plugins.cloudflare-r2.credentials.accessKeyId',
            'plugins.cloudflare-r2.credentials.secretAccessKey',
        ],
        if: config => config.flavor.graphql,
    })
], CloudflareR2Module);
export { CloudflareR2Module };
let AwsS3Module = class AwsS3Module {
};
AwsS3Module = __decorate([
    Plugin({
        name: 'aws-s3',
        requires: [
            'plugins.aws-s3.credentials.accessKeyId',
            'plugins.aws-s3.credentials.secretAccessKey',
        ],
        if: config => config.flavor.graphql,
    })
], AwsS3Module);
export { AwsS3Module };
//# sourceMappingURL=index.js.map