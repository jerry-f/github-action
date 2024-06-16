import { Config } from '../../config';
import { StorageConfig, StorageProviderType } from '../config';
import type { StorageProvider } from './provider';
export declare function registerStorageProvider(type: StorageProviderType, providerFactory: (config: Config, bucket: string) => StorageProvider): void;
export declare class StorageProviderFactory {
    private readonly config;
    constructor(config: Config);
    create(storage: StorageConfig): StorageProvider;
}
export type * from './provider';
//# sourceMappingURL=index.d.ts.map