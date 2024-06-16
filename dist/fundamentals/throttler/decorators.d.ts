import { SkipThrottle } from '@nestjs/throttler';
import { ThrottlerType } from './config';
export type Throttlers = 'default' | 'strict' | 'authenticated';
export declare const THROTTLER_PROTECTED = "affine_throttler:protected";
/**
 * Choose what throttler to use
 *
 * If a Controller or Query do not protected behind a Throttler,
 * it will never be rate limited.
 *
 * - default: 120 calls within 60 seconds
 * - strict: 10 calls within 60 seconds
 * - authenticated: no rate limit for authenticated users, apply [default] throttler for unauthenticated users
 *
 * @example
 *
 * \@Throttle()
 * \@Throttle('strict')
 *
 * // the config call be override by the second parameter,
 * // and the call count will be calculated separately
 * \@Throttle('default', { limit: 10, ttl: 10 })
 *
 */
export declare function Throttle(type?: ThrottlerType | 'authenticated', override?: {
    limit?: number;
    ttl?: number;
}): MethodDecorator & ClassDecorator;
export { SkipThrottle };
//# sourceMappingURL=decorators.d.ts.map