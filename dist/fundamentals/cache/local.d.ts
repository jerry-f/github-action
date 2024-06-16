import Keyv from 'keyv';
import type { Cache, CacheSetOptions } from './def';
export declare class LocalCache implements Cache {
    private readonly kv;
    constructor(opts?: Keyv.Options<any>);
    get<T = unknown>(key: string): Promise<T | undefined>;
    set<T = unknown>(key: string, value: T, opts?: CacheSetOptions): Promise<boolean>;
    setnx<T = unknown>(key: string, value: T, opts?: CacheSetOptions | undefined): Promise<boolean>;
    increase(key: string, count?: number): Promise<number>;
    decrease(key: string, count?: number): Promise<number>;
    delete(key: string): Promise<boolean>;
    has(key: string): Promise<boolean>;
    ttl(key: string): Promise<number>;
    expire(key: string, ttl: number): Promise<boolean>;
    private getArray;
    private setArray;
    pushBack<T = unknown>(key: string, ...values: T[]): Promise<number>;
    pushFront<T = unknown>(key: string, ...values: T[]): Promise<number>;
    len(key: string): Promise<number>;
    /**
     * list array elements with `[start, end]`
     * the end indice is inclusive
     */
    list<T = unknown>(key: string, start: number, end: number): Promise<T[]>;
    private trim;
    popFront<T = unknown>(key: string, count?: number): Promise<T[]>;
    popBack<T = unknown>(key: string, count?: number): Promise<T[]>;
    private getMap;
    private setMap;
    mapGet<T = unknown>(map: string, key: string): Promise<T | undefined>;
    mapSet<T = unknown>(map: string, key: string, value: T): Promise<boolean>;
    mapDelete(map: string, key: string): Promise<boolean>;
    mapIncrease(map: string, key: string, count?: number): Promise<number>;
    mapDecrease(map: string, key: string, count?: number): Promise<number>;
    mapKeys(map: string): Promise<string[]>;
    mapRandomKey(map: string): Promise<string | undefined>;
    mapLen(map: string): Promise<number>;
}
//# sourceMappingURL=local.d.ts.map