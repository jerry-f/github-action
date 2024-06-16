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
import { ForbiddenException } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, } from '@nestjs/graphql';
import { CurrentUser } from '../auth';
import { Admin } from '../common';
import { FeatureManagementService, FeatureType } from '../features';
import { PermissionService } from './permission';
import { WorkspaceType } from './types';
let WorkspaceManagementResolver = class WorkspaceManagementResolver {
    constructor(feature, permission) {
        this.feature = feature;
        this.permission = permission;
    }
    async addWorkspaceFeature(workspaceId, feature) {
        return this.feature.addWorkspaceFeatures(workspaceId, feature);
    }
    async removeWorkspaceFeature(workspaceId, feature) {
        return this.feature.removeWorkspaceFeature(workspaceId, feature);
    }
    async listWorkspaceFeatures(feature) {
        return this.feature.listFeatureWorkspaces(feature);
    }
    async setWorkspaceExperimentalFeature(user, workspaceId, feature, enable) {
        if (!(await this.feature.canEarlyAccess(user.email))) {
            throw new ForbiddenException('You are not allowed to do this');
        }
        const owner = await this.permission.getWorkspaceOwner(workspaceId);
        const availableFeatures = await this.availableFeatures(user);
        if (owner.user.id !== user.id || !availableFeatures.includes(feature)) {
            throw new ForbiddenException('You are not allowed to do this');
        }
        if (enable) {
            return await this.feature
                .addWorkspaceFeatures(workspaceId, feature, 'add by experimental feature api')
                .then(id => id > 0);
        }
        else {
            return await this.feature.removeWorkspaceFeature(workspaceId, feature);
        }
    }
    async availableFeatures(user) {
        return await this.feature.getActivatedUserFeatures(user.id);
    }
    async features(workspace) {
        return this.feature.getWorkspaceFeatures(workspace.id);
    }
};
__decorate([
    Admin(),
    Mutation(() => Int),
    __param(0, Args('workspaceId')),
    __param(1, Args('feature', { type: () => FeatureType })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WorkspaceManagementResolver.prototype, "addWorkspaceFeature", null);
__decorate([
    Admin(),
    Mutation(() => Int),
    __param(0, Args('workspaceId')),
    __param(1, Args('feature', { type: () => FeatureType })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WorkspaceManagementResolver.prototype, "removeWorkspaceFeature", null);
__decorate([
    Admin(),
    Query(() => [WorkspaceType]),
    __param(0, Args('feature', { type: () => FeatureType })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkspaceManagementResolver.prototype, "listWorkspaceFeatures", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('feature', { type: () => FeatureType })),
    __param(3, Args('enable')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], WorkspaceManagementResolver.prototype, "setWorkspaceExperimentalFeature", null);
__decorate([
    ResolveField(() => [FeatureType], {
        description: 'Available features of workspace',
        complexity: 2,
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkspaceManagementResolver.prototype, "availableFeatures", null);
__decorate([
    ResolveField(() => [FeatureType], {
        description: 'Enabled features of workspace',
        complexity: 2,
    }),
    __param(0, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType]),
    __metadata("design:returntype", Promise)
], WorkspaceManagementResolver.prototype, "features", null);
WorkspaceManagementResolver = __decorate([
    Resolver(() => WorkspaceType),
    __metadata("design:paramtypes", [FeatureManagementService,
        PermissionService])
], WorkspaceManagementResolver);
export { WorkspaceManagementResolver };
//# sourceMappingURL=management.js.map