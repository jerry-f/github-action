import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis as IORedis, RedisOptions } from 'ioredis';
import { Config } from '../../fundamentals/config';
declare class Redis extends IORedis implements OnModuleDestroy, OnModuleInit {
    logger: Logger;
    constructor(opts: RedisOptions);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): void;
}
export declare class CacheRedis extends Redis {
    constructor(config: Config);
}
export declare class SessionRedis extends Redis {
    constructor(config: Config);
}
export declare class SocketIoRedis extends Redis {
    constructor(config: Config);
}
export {};
//# sourceMappingURL=instances.d.ts.map