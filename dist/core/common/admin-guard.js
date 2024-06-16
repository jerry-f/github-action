var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getRequestResponseFromContext } from '../../fundamentals';
import { FeatureManagementService } from '../features';
let AdminGuard = class AdminGuard {
    constructor(ref) {
        this.ref = ref;
    }
    onModuleInit() {
        this.feature = this.ref.get(FeatureManagementService, { strict: false });
    }
    async canActivate(context) {
        const { req } = getRequestResponseFromContext(context);
        let allow = false;
        if (req.user) {
            allow = await this.feature.isAdmin(req.user.id);
        }
        if (!allow) {
            throw new UnauthorizedException('Your operation is not allowed.');
        }
        return true;
    }
};
AdminGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ModuleRef])
], AdminGuard);
export { AdminGuard };
/**
 * This guard is used to protect routes/queries/mutations that require a user to be administrator.
 *
 * @example
 *
 * ```typescript
 * \@Admin()
 * \@Mutation(() => UserType)
 * createAccount(userInput: UserInput) {
 *   // ...
 * }
 * ```
 */
export const Admin = () => {
    return UseGuards(AdminGuard);
};
//# sourceMappingURL=admin-guard.js.map