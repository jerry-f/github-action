var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MutexService_1;
import { randomUUID } from 'node:crypto';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CONTEXT } from '@nestjs/graphql';
import { retryable } from '../utils/promise';
import { Locker } from './local-lock';
export const MUTEX_RETRY = 5;
export const MUTEX_WAIT = 100;
let MutexService = MutexService_1 = class MutexService {
    constructor(context, ref) {
        this.context = context;
        this.ref = ref;
        this.logger = new Logger(MutexService_1.name);
        // nestjs will always find and injecting the locker from local module
        // so the RedisLocker implemented by the plugin mechanism will not be able to overwrite the internal locker
        // we need to use find and get the locker from the `ModuleRef` manually
        //
        // NOTE: when a `constructor` execute in normal service, the Locker module we expect may not have been initialized
        //       but in the Service with `Scope.REQUEST`, we will create a separate Service instance for each request
        //       at this time, all modules have been initialized, so we able to get the correct Locker instance in `constructor`
        this.locker = this.ref.get(Locker, { strict: false });
    }
    getId() {
        let id = this.context.req.headers['x-transaction-id'];
        if (!id) {
            id = randomUUID();
            this.context.req.headers['x-transaction-id'] = id;
        }
        return id;
    }
    /**
     * lock an resource and return a lock guard, which will release the lock when disposed
     *
     * if the lock is not available, it will retry for [MUTEX_RETRY] times
     *
     * usage:
     * ```typescript
     * {
     *   // lock is acquired here
     *   await using lock = await mutex.lock('resource-key');
     *   if (lock) {
     *     // do something
     *   } else {
     *     // failed to lock
     *   }
     * }
     * // lock is released here
     * ```
     * @param key resource key
     * @returns LockGuard
     */
    async lock(key) {
        try {
            return await retryable(() => this.locker.lock(this.getId(), key), MUTEX_RETRY, MUTEX_WAIT);
        }
        catch (e) {
            this.logger.error(`Failed to lock resource [${key}] after retry ${MUTEX_RETRY} times`, e);
            return undefined;
        }
    }
};
MutexService = MutexService_1 = __decorate([
    Injectable({ scope: Scope.REQUEST }),
    __param(0, Inject(CONTEXT)),
    __metadata("design:paramtypes", [Object, ModuleRef])
], MutexService);
export { MutexService };
//# sourceMappingURL=mutex.js.map