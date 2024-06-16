import { ILocker, Lock } from '../../fundamentals';
import { SessionRedis } from './instances';
export declare class RedisMutexLocker implements ILocker {
    private readonly redis;
    private readonly logger;
    constructor(redis: SessionRedis);
    lock(owner: string, key: string): Promise<Lock>;
}
//# sourceMappingURL=mutex.d.ts.map