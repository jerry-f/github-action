import { S3ClientConfig, S3ClientConfigType } from '@aws-sdk/client-s3';
import { ModuleConfig } from '../../fundamentals/config';
type WARNING = '__YOU_SHOULD_NOT_MANUALLY_CONFIGURATE_THIS_TYPE__';
declare module '../../fundamentals/storage/config' {
    interface StorageProvidersConfig {
        'cloudflare-r2'?: WARNING;
        'aws-s3'?: WARNING;
    }
}
export type S3StorageConfig = S3ClientConfigType;
export type R2StorageConfig = S3ClientConfigType & {
    accountId?: string;
};
declare module '../config' {
    interface PluginsConfig {
        'aws-s3': ModuleConfig<S3ClientConfig>;
        'cloudflare-r2': ModuleConfig<R2StorageConfig>;
    }
}
export {};
//# sourceMappingURL=config.d.ts.map