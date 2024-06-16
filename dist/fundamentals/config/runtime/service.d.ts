import { OnApplicationBootstrap } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Cache } from '../../cache';
import { AppRuntimeConfigModules, FlattenedAppRuntimeConfig } from '../types';
/**
 * runtime.fetch(k) // v1
 * runtime.fetchAll(k1, k2, k3) // [v1, v2, v3]
 * runtime.set(k, v)
 * runtime.update(k, (v) => {
 *   v.xxx = 'yyy';
 *   return v
 * })
 */
export declare class Runtime implements OnApplicationBootstrap {
    private readonly db;
    private readonly cache;
    private readonly logger;
    constructor(db: PrismaClient, cache: Cache);
    onApplicationBootstrap(): Promise<void>;
    fetch<K extends keyof FlattenedAppRuntimeConfig>(k: K): Promise<FlattenedAppRuntimeConfig[K]>;
    fetchAll<Selector extends {
        [Key in keyof FlattenedAppRuntimeConfig]?: true;
    }>(selector: Selector): Promise<{
        [Key in keyof Selector]: FlattenedAppRuntimeConfig[Key];
    }>;
    list(module?: AppRuntimeConfigModules): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.RuntimeConfigType;
        module: string;
        key: string;
        value: import(".prisma/client").Prisma.JsonValue;
        description: string;
        updatedAt: Date;
        deletedAt: Date | null;
        lastUpdatedBy: string | null;
    }[]>;
    set<K extends keyof FlattenedAppRuntimeConfig, V = FlattenedAppRuntimeConfig[K]>(key: K, value: V): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.RuntimeConfigType;
        module: string;
        key: string;
        value: import(".prisma/client").Prisma.JsonValue;
        description: string;
        updatedAt: Date;
        deletedAt: Date | null;
        lastUpdatedBy: string | null;
    }>;
    update<K extends keyof FlattenedAppRuntimeConfig, V = FlattenedAppRuntimeConfig[K]>(k: K, modifier: (v: V) => V | Promise<V>): Promise<V>;
    loadDb<K extends keyof FlattenedAppRuntimeConfig>(k: K): Promise<FlattenedAppRuntimeConfig[K] | undefined>;
    loadCache<K extends keyof FlattenedAppRuntimeConfig>(k: K): Promise<FlattenedAppRuntimeConfig[K] | undefined>;
    setCache<K extends keyof FlattenedAppRuntimeConfig>(k: K, v: FlattenedAppRuntimeConfig[K]): Promise<boolean>;
    /**
     * Upgrade the DB with latest runtime configs
     */
    private upgradeDB;
}
//# sourceMappingURL=service.d.ts.map