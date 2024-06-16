var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CacheInterceptor_1;
import { Injectable, Logger, SetMetadata, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { mergeMap, of } from 'rxjs';
import { Cache } from './instances';
export const MakeCache = (key, args) => SetMetadata('cacheKey', [key, args]);
export const PreventCache = (key, args) => SetMetadata('preventCache', [key, args]);
let CacheInterceptor = CacheInterceptor_1 = class CacheInterceptor {
    constructor(reflector, cache) {
        this.reflector = reflector;
        this.cache = cache;
        this.logger = new Logger(CacheInterceptor_1.name);
    }
    async intercept(ctx, next) {
        const key = this.reflector.get('cacheKey', ctx.getHandler());
        const preventKey = this.reflector.get('preventCache', ctx.getHandler());
        if (preventKey) {
            const key = await this.getCacheKey(ctx, preventKey);
            if (key) {
                this.logger.verbose(`cache ${key} staled`);
                await this.cache.delete(key);
            }
            return next.handle();
        }
        else if (!key) {
            return next.handle();
        }
        const cacheKey = await this.getCacheKey(ctx, key);
        if (!cacheKey) {
            return next.handle();
        }
        const cachedData = await this.cache.get(cacheKey);
        if (cachedData) {
            this.logger.verbose(`cache ${cacheKey} hit`);
            return of(cachedData);
        }
        else {
            this.logger.verbose(`cache ${cacheKey} miss`);
            return next.handle().pipe(mergeMap(async (result) => {
                await this.cache.set(cacheKey, result);
                return result;
            }));
        }
    }
    async getCacheKey(ctx, config) {
        const [key, params] = config;
        if (!params) {
            return key.join(':');
        }
        else if (ctx.getType() === 'graphql') {
            const args = GqlExecutionContext.create(ctx).getArgs();
            const cacheKey = params
                .map(name => args[name])
                .filter(v => v)
                .join(':');
            if (cacheKey) {
                return [...key, cacheKey].join(':');
            }
            else {
                return key.join(':');
            }
        }
        return null;
    }
};
CacheInterceptor = CacheInterceptor_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector,
        Cache])
], CacheInterceptor);
export { CacheInterceptor };
//# sourceMappingURL=interceptor.js.map