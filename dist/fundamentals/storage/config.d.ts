import { ModuleConfig } from '../config';
export interface FsStorageConfig {
    path: string;
}
export interface StorageProvidersConfig {
    fs?: FsStorageConfig;
}
declare module '../config' {
    interface AppConfig {
        storageProviders: ModuleConfig<StorageProvidersConfig>;
    }
}
export type StorageProviderType = keyof StorageProvidersConfig;
export type StorageConfig<Ext = unknown> = {
    provider: StorageProviderType;
    bucket: string;
} & Ext;
export interface StoragesConfig {
    avatar: StorageConfig<{
        publicLinkFactory: (key: string) => string;
    }>;
    blob: StorageConfig;
    copilot: StorageConfig;
}
export interface AFFiNEStorageConfig {
    /**
     * All providers for object storage
     *
     * Support different providers for different usage at the same time.
     */
    providers: StorageProvidersConfig;
    storages: StoragesConfig;
}
export type StorageProviders = AFFiNEStorageConfig['providers'];
export type Storages = keyof AFFiNEStorageConfig['storages'];
export declare function getDefaultAFFiNEStorageConfig(): AFFiNEStorageConfig;
//# sourceMappingURL=config.d.ts.map