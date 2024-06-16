var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { Cache } from '../cache';
import { Lock } from './lock';
let Locker = class Locker {
    constructor(cache) {
        this.cache = cache;
    }
    async lock(owner, key) {
        const lockKey = `MutexLock:${key}`;
        const prevOwner = await this.cache.get(lockKey);
        if (prevOwner && prevOwner !== owner) {
            throw new Error(`Lock for resource [${key}] has been holder by others`);
        }
        const acquired = await this.cache.set(lockKey, owner);
        if (acquired) {
            return new Lock(async () => {
                await this.cache.delete(lockKey);
            });
        }
        throw new Error(`Failed to acquire lock for resource [${key}]`);
    }
};
Locker = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Cache])
], Locker);
export { Locker };
//# sourceMappingURL=local-lock.js.map