var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, SetMetadata, UnauthorizedException, UseGuards, } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { getRequestResponseFromContext } from '../../fundamentals';
import { AuthService, parseAuthUserSeqNum } from './service';
function extractTokenFromHeader(authorization) {
    if (!/^Bearer\s/i.test(authorization)) {
        return;
    }
    return authorization.substring(7);
}
const PUBLIC_ENTRYPOINT_SYMBOL = Symbol('public');
let AuthGuard = class AuthGuard {
    constructor(ref, reflector) {
        this.ref = ref;
        this.reflector = reflector;
    }
    onModuleInit() {
        this.auth = this.ref.get(AuthService, { strict: false });
    }
    async canActivate(context) {
        const { req, res } = getRequestResponseFromContext(context);
        // check cookie
        let sessionToken = req.cookies[AuthService.sessionCookieName];
        if (!sessionToken && req.headers.authorization) {
            sessionToken = extractTokenFromHeader(req.headers.authorization);
        }
        if (sessionToken) {
            const userSeq = parseAuthUserSeqNum(req.headers[AuthService.authUserSeqHeaderName]);
            const { user, expiresAt } = await this.auth.getUser(sessionToken, userSeq);
            if (res && user && expiresAt) {
                await this.auth.refreshUserSessionIfNeeded(req, res, sessionToken, user.id, expiresAt);
            }
            if (user) {
                req.sid = sessionToken;
                req.user = user;
            }
        }
        // api is public
        const isPublic = this.reflector.getAllAndOverride(PUBLIC_ENTRYPOINT_SYMBOL, [context.getClass(), context.getHandler()]);
        if (isPublic) {
            return true;
        }
        if (!req.user) {
            throw new UnauthorizedException('You are not signed in.');
        }
        return true;
    }
};
AuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ModuleRef,
        Reflector])
], AuthGuard);
export { AuthGuard };
/**
 * This guard is used to protect routes/queries/mutations that require a user to be logged in.
 *
 * The `@CurrentUser()` parameter decorator used in a `Auth` guarded queries would always give us the user because the `Auth` guard will
 * fast throw if user is not logged in.
 *
 * @example
 *
 * ```typescript
 * \@Auth()
 * \@Query(() => UserType)
 * user(@CurrentUser() user: CurrentUser) {
 *   return user;
 * }
 * ```
 */
export const Auth = () => {
    return UseGuards(AuthGuard);
};
// api is public accessible
export const Public = () => SetMetadata(PUBLIC_ENTRYPOINT_SYMBOL, true);
//# sourceMappingURL=guard.js.map