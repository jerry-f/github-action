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
import { BadRequestException } from '@nestjs/common';
import { Args, Context, Int, Mutation, Parent, Query, registerEnumType, ResolveField, Resolver, } from '@nestjs/graphql';
import { sessionUser } from '../auth/service';
import { Admin } from '../common';
import { UserService } from '../user/service';
import { UserType } from '../user/types';
import { EarlyAccessType, FeatureManagementService } from './management';
import { FeatureType } from './types';
registerEnumType(EarlyAccessType, {
    name: 'EarlyAccessType',
});
let FeatureManagementResolver = class FeatureManagementResolver {
    constructor(users, feature) {
        this.users = users;
        this.feature = feature;
    }
    async userFeatures(user) {
        return this.feature.getActivatedUserFeatures(user.id);
    }
    async addToEarlyAccess(email, type) {
        const user = await this.users.findUserByEmail(email);
        if (user) {
            return this.feature.addEarlyAccess(user.id, type);
        }
        else {
            const user = await this.users.createAnonymousUser(email, {
                registered: false,
            });
            return this.feature.addEarlyAccess(user.id, type);
        }
    }
    async removeEarlyAccess(email) {
        const user = await this.users.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException(`User ${email} not found`);
        }
        return this.feature.removeEarlyAccess(user.id);
    }
    async earlyAccessUsers(ctx) {
        // allow query other user's subscription
        ctx.isAdminQuery = true;
        return this.feature.listEarlyAccess().then(users => {
            return users.map(sessionUser);
        });
    }
    async addAdminister(email) {
        const user = await this.users.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException(`User ${email} not found`);
        }
        await this.feature.addAdmin(user.id);
        return true;
    }
};
__decorate([
    ResolveField(() => [FeatureType], {
        name: 'features',
        description: 'Enabled features of a user',
    }),
    __param(0, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserType]),
    __metadata("design:returntype", Promise)
], FeatureManagementResolver.prototype, "userFeatures", null);
__decorate([
    Admin(),
    Mutation(() => Int),
    __param(0, Args('email')),
    __param(1, Args({ name: 'type', type: () => EarlyAccessType })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FeatureManagementResolver.prototype, "addToEarlyAccess", null);
__decorate([
    Admin(),
    Mutation(() => Int),
    __param(0, Args('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeatureManagementResolver.prototype, "removeEarlyAccess", null);
__decorate([
    Admin(),
    Query(() => [UserType]),
    __param(0, Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeatureManagementResolver.prototype, "earlyAccessUsers", null);
__decorate([
    Admin(),
    Mutation(() => Boolean),
    __param(0, Args('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeatureManagementResolver.prototype, "addAdminister", null);
FeatureManagementResolver = __decorate([
    Resolver(() => UserType),
    __metadata("design:paramtypes", [UserService,
        FeatureManagementService])
], FeatureManagementResolver);
export { FeatureManagementResolver };
//# sourceMappingURL=resolver.js.map