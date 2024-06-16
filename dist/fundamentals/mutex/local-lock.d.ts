import { Cache } from '../cache';
import { Lock, Locker as ILocker } from './lock';
export declare class Locker implements ILocker {
    private readonly cache;
    constructor(cache: Cache);
    lock(owner: string, key: string): Promise<Lock>;
}
//# sourceMappingURL=local-lock.d.ts.map