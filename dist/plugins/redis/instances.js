var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, Logger, } from '@nestjs/common';
import { Redis as IORedis } from 'ioredis';
import { Config } from '../../fundamentals/config';
class Redis extends IORedis {
    constructor(opts) {
        super({
            ...opts,
            lazyConnect: true,
        });
        this.logger = new Logger(Redis.name);
    }
    async onModuleInit() {
        await this.connect().catch(() => {
            this.logger.error('Failed to connect to Redis server.');
        });
    }
    onModuleDestroy() {
        this.disconnect();
    }
}
let CacheRedis = class CacheRedis extends Redis {
    constructor(config) {
        super(config.plugins.redis);
    }
};
CacheRedis = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config])
], CacheRedis);
export { CacheRedis };
let SessionRedis = class SessionRedis extends Redis {
    constructor(config) {
        super({ ...config.plugins.redis, db: (config.plugins.redis.db ?? 0) + 2 });
    }
};
SessionRedis = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config])
], SessionRedis);
export { SessionRedis };
let SocketIoRedis = class SocketIoRedis extends Redis {
    constructor(config) {
        super({ ...config.plugins.redis, db: (config.plugins.redis.db ?? 0) + 3 });
    }
};
SocketIoRedis = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config])
], SocketIoRedis);
export { SocketIoRedis };
//# sourceMappingURL=instances.js.map