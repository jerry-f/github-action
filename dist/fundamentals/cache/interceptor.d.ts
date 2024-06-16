import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Cache } from './instances';
export declare const MakeCache: (key: string[], args?: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const PreventCache: (key: string[], args?: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class CacheInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly cache;
    private readonly logger;
    constructor(reflector: Reflector, cache: Cache);
    intercept(ctx: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>>;
    private getCacheKey;
}
//# sourceMappingURL=interceptor.d.ts.map