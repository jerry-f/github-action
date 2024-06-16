import './config';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerGuard, type ThrottlerModuleOptions, ThrottlerOptions, ThrottlerStorageService } from '@nestjs/throttler';
import type { Request } from 'express';
import { Config } from '../config';
import type { ThrottlerType } from './config';
export declare class ThrottlerStorage extends ThrottlerStorageService {
}
export declare class CloudThrottlerGuard extends ThrottlerGuard {
    private readonly config;
    constructor(options: ThrottlerModuleOptions, storageService: ThrottlerStorage, reflector: Reflector, config: Config);
    getRequestResponse(context: ExecutionContext): any;
    getTracker(req: Request): Promise<string>;
    generateKey(context: ExecutionContext, tracker: string, throttler: string): string;
    handleRequest(context: ExecutionContext, limit: number, ttl: number, throttlerOptions: ThrottlerOptions): Promise<boolean>;
    canActivate(context: ExecutionContext): Promise<boolean>;
    getSpecifiedThrottler(context: ExecutionContext): ThrottlerType | undefined;
}
export declare class RateLimiterModule {
}
export * from './decorators';
//# sourceMappingURL=index.d.ts.map