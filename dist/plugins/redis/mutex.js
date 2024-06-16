var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RedisMutexLocker_1;
import { Injectable, Logger } from '@nestjs/common';
import { Command } from 'ioredis';
import { Lock } from '../../fundamentals';
import { SessionRedis } from './instances';
// === atomic mutex lock ===
// acquire lock
// return 1 if lock is acquired
// return 0 if lock is not acquired
const lockScript = `local key = KEYS[1]
local owner = ARGV[1]

-- if lock is not exists or lock is owned by the owner
-- then set lock to the owner and return 1, otherwise return 0
-- if the lock is not released correctly due to unexpected reasons
-- lock will be released after 60 seconds
if redis.call("get", key) == owner or redis.call("set", key, owner, "NX", "EX", 60) then
  return 1
else
  return 0
end`;
// release lock
// return 1 if lock is released or lock is not exists
// return 0 if lock is not owned by the owner
const unlockScript = `local key = KEYS[1]
local owner = ARGV[1]

local value = redis.call("get", key)
if value == owner then
  return redis.call("del", key)
elseif value == nil then
  return 1
else
  return 0
end`;
let RedisMutexLocker = RedisMutexLocker_1 = class RedisMutexLocker {
    constructor(redis) {
        this.redis = redis;
        this.logger = new Logger(RedisMutexLocker_1.name);
    }
    async lock(owner, key) {
        const lockKey = `MutexLock:${key}`;
        this.logger.verbose(`Client ${owner} is trying to lock resource ${key}`);
        const success = await this.redis.sendCommand(new Command('EVAL', [lockScript, '1', lockKey, owner]));
        if (success === 1) {
            return new Lock(async () => {
                const result = await this.redis.sendCommand(new Command('EVAL', [unlockScript, '1', lockKey, owner]));
                if (result === 0) {
                    throw new Error(`Failed to release lock ${key}`);
                }
            });
        }
        throw new Error(`Failed to acquire lock for resource [${key}]`);
    }
};
RedisMutexLocker = RedisMutexLocker_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SessionRedis])
], RedisMutexLocker);
export { RedisMutexLocker };
//# sourceMappingURL=mutex.js.map