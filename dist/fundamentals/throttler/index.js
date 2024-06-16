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
import './config';
import { Global, Injectable, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectThrottlerOptions, InjectThrottlerStorage, ThrottlerGuard, ThrottlerModule, ThrottlerStorageService, } from '@nestjs/throttler';
import { Config } from '../config';
import { getRequestResponseFromContext } from '../utils/request';
import { THROTTLER_PROTECTED } from './decorators';
let ThrottlerStorage = class ThrottlerStorage extends ThrottlerStorageService {
};
ThrottlerStorage = __decorate([
    Injectable()
], ThrottlerStorage);
export { ThrottlerStorage };
let CustomOptionsFactory = class CustomOptionsFactory {
    constructor(storage) {
        this.storage = storage;
    }
    createThrottlerOptions() {
        const options = {
            throttlers: Object.entries(AFFiNE.throttler).map(([name, config]) => ({
                name,
                ...config,
            })),
            storage: this.storage,
        };
        return options;
    }
};
CustomOptionsFactory = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ThrottlerStorage])
], CustomOptionsFactory);
let CloudThrottlerGuard = class CloudThrottlerGuard extends ThrottlerGuard {
    constructor(options, storageService, reflector, config) {
        super(options, storageService, reflector);
        this.config = config;
    }
    getRequestResponse(context) {
        return getRequestResponseFromContext(context);
    }
    getTracker(req) {
        return Promise.resolve(
        //           ↓ prefer session id if available
        `throttler:${req.sid ?? req.get('CF-Connecting-IP') ?? req.get('CF-ray') ?? req.ip}`
        // ^ throttler prefix make the key in store recognizable
        );
    }
    generateKey(context, tracker, throttler) {
        if (tracker.endsWith(';custom')) {
            return `${tracker};${throttler}:${context.getClass().name}.${context.getHandler().name}`;
        }
        return `${tracker};${throttler}`;
    }
    async handleRequest(context, limit, ttl, throttlerOptions) {
        // give it 'default' if no throttler is specified,
        // so the unauthenticated users visits will always hit default throttler
        // authenticated users will directly bypass unprotected APIs in [CloudThrottlerGuard.canActivate]
        const throttler = this.getSpecifiedThrottler(context) ?? 'default';
        // by pass unmatched throttlers
        if (throttlerOptions.name !== throttler) {
            return true;
        }
        const { req, res } = this.getRequestResponse(context);
        const ignoreUserAgents = throttlerOptions.ignoreUserAgents ?? this.commonOptions.ignoreUserAgents;
        if (Array.isArray(ignoreUserAgents)) {
            for (const pattern of ignoreUserAgents) {
                const ua = req.headers['user-agent'];
                if (ua && pattern.test(ua)) {
                    return true;
                }
            }
        }
        let tracker = await this.getTracker(req);
        if (this.config.node.dev) {
            limit = Number.MAX_SAFE_INTEGER;
        }
        else {
            // custom limit or ttl APIs will be treated standalone
            if (limit !== throttlerOptions.limit || ttl !== throttlerOptions.ttl) {
                tracker += ';custom';
            }
        }
        const key = this.generateKey(context, tracker, throttlerOptions.name ?? 'default');
        const { timeToExpire, totalHits } = await this.storageService.increment(key, ttl);
        if (totalHits > limit) {
            res.header('Retry-After', timeToExpire.toString());
            await this.throwThrottlingException(context, {
                limit,
                ttl,
                key,
                tracker,
                totalHits,
                timeToExpire,
            });
        }
        res.header(`${this.headerPrefix}-Limit`, limit.toString());
        res.header(`${this.headerPrefix}-Remaining`, (limit - totalHits).toString());
        res.header(`${this.headerPrefix}-Reset`, timeToExpire.toString());
        return true;
    }
    async canActivate(context) {
        const { req } = this.getRequestResponse(context);
        const throttler = this.getSpecifiedThrottler(context);
        // if user is logged in, bypass non-protected handlers
        if (!throttler && req.user) {
            return true;
        }
        return super.canActivate(context);
    }
    getSpecifiedThrottler(context) {
        const throttler = this.reflector.getAllAndOverride(THROTTLER_PROTECTED, [context.getHandler(), context.getClass()]);
        return throttler === 'authenticated' ? undefined : throttler;
    }
};
CloudThrottlerGuard = __decorate([
    Injectable(),
    __param(0, InjectThrottlerOptions()),
    __param(1, InjectThrottlerStorage()),
    __metadata("design:paramtypes", [Object, ThrottlerStorage,
        Reflector,
        Config])
], CloudThrottlerGuard);
export { CloudThrottlerGuard };
let RateLimiterModule = class RateLimiterModule {
};
RateLimiterModule = __decorate([
    Global(),
    Module({
        imports: [
            ThrottlerModule.forRootAsync({
                useClass: CustomOptionsFactory,
            }),
        ],
        providers: [ThrottlerStorage, CloudThrottlerGuard],
        exports: [ThrottlerStorage, CloudThrottlerGuard],
    })
], RateLimiterModule);
export { RateLimiterModule };
export * from './decorators';
//# sourceMappingURL=index.js.map