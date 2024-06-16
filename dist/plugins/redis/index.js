var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import './config';
import { Global } from '@nestjs/common';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { Cache, Locker, SessionCache } from '../../fundamentals';
import { ThrottlerStorage } from '../../fundamentals/throttler';
import { SocketIoAdapterImpl } from '../../fundamentals/websocket';
import { Plugin } from '../registry';
import { RedisCache } from './cache';
import { CacheRedis, SessionRedis, SocketIoRedis } from './instances';
import { RedisMutexLocker } from './mutex';
import { createSockerIoAdapterImpl } from './ws-adapter';
function makeProvider(token, impl) {
    return {
        provide: token,
        useFactory: (redis) => {
            return new RedisCache(redis);
        },
        inject: [impl],
    };
}
// cache
const cacheProvider = makeProvider(Cache, CacheRedis);
const sessionCacheProvider = makeProvider(SessionCache, SessionRedis);
// throttler
const throttlerStorageProvider = {
    provide: ThrottlerStorage,
    useFactory: (redis) => {
        return new ThrottlerStorageRedisService(redis);
    },
    inject: [SessionRedis],
};
// socket io
const socketIoRedisAdapterProvider = {
    provide: SocketIoAdapterImpl,
    useFactory: (redis) => {
        return createSockerIoAdapterImpl(redis);
    },
    inject: [SocketIoRedis],
};
// mutex
const mutexRedisAdapterProvider = {
    provide: Locker,
    useClass: RedisMutexLocker,
};
let RedisModule = class RedisModule {
};
RedisModule = __decorate([
    Global(),
    Plugin({
        name: 'redis',
        providers: [CacheRedis, SessionRedis, SocketIoRedis],
        overrides: [
            cacheProvider,
            sessionCacheProvider,
            socketIoRedisAdapterProvider,
            throttlerStorageProvider,
            mutexRedisAdapterProvider,
        ],
        requires: ['plugins.redis.host'],
    })
], RedisModule);
export { RedisModule };
//# sourceMappingURL=index.js.map