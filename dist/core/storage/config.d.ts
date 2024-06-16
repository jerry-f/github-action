import { ModuleConfig } from '../../fundamentals/config';
import { StorageProviderType } from '../../fundamentals/storage';
export type StorageConfig<Ext = unknown> = {
    provider: StorageProviderType;
    bucket: string;
} & Ext;
export interface StorageStartupConfigurations {
    avatar: StorageConfig<{
        publicLinkFactory: (key: string) => string;
    }>;
    blob: StorageConfig;
}
declare module '../../fundamentals/config' {
    interface AppConfig {
        storages: ModuleConfig<StorageStartupConfigurations>;
    }
}
//# sourceMappingURL=config.d.ts.map