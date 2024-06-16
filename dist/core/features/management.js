var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FeatureManagementService_1;
import { Injectable, Logger } from '@nestjs/common';
import { Config } from '../../fundamentals';
import { UserService } from '../user/service';
import { FeatureService } from './service';
import { FeatureType } from './types';
const STAFF = ['@toeverything.info', '@affine.pro'];
export var EarlyAccessType;
(function (EarlyAccessType) {
    EarlyAccessType["App"] = "app";
    EarlyAccessType["AI"] = "ai";
})(EarlyAccessType || (EarlyAccessType = {}));
let FeatureManagementService = FeatureManagementService_1 = class FeatureManagementService {
    constructor(feature, user, config) {
        this.feature = feature;
        this.user = user;
        this.config = config;
        this.logger = new Logger(FeatureManagementService_1.name);
    }
    // ======== Admin ========
    isStaff(email) {
        for (const domain of STAFF) {
            if (email.endsWith(domain)) {
                return true;
            }
        }
        return false;
    }
    isAdmin(userId) {
        return this.feature.hasUserFeature(userId, FeatureType.Admin);
    }
    addAdmin(userId) {
        return this.feature.addUserFeature(userId, FeatureType.Admin, 'Admin user');
    }
    // ======== Early Access ========
    async addEarlyAccess(userId, type = EarlyAccessType.App) {
        return this.feature.addUserFeature(userId, type === EarlyAccessType.App
            ? FeatureType.EarlyAccess
            : FeatureType.AIEarlyAccess, 'Early access user');
    }
    async removeEarlyAccess(userId, type = EarlyAccessType.App) {
        return this.feature.removeUserFeature(userId, type === EarlyAccessType.App
            ? FeatureType.EarlyAccess
            : FeatureType.AIEarlyAccess);
    }
    async listEarlyAccess(type = EarlyAccessType.App) {
        return this.feature.listFeatureUsers(type === EarlyAccessType.App
            ? FeatureType.EarlyAccess
            : FeatureType.AIEarlyAccess);
    }
    async isEarlyAccessUser(userId, type = EarlyAccessType.App) {
        return await this.feature
            .hasUserFeature(userId, type === EarlyAccessType.App
            ? FeatureType.EarlyAccess
            : FeatureType.AIEarlyAccess)
            .catch(() => false);
    }
    /// check early access by email
    async canEarlyAccess(email, type = EarlyAccessType.App) {
        const earlyAccessControlEnabled = await this.config.runtime.fetch('flags/earlyAccessControl');
        if (earlyAccessControlEnabled && !this.isStaff(email)) {
            const user = await this.user.findUserByEmail(email);
            if (!user) {
                return false;
            }
            return this.isEarlyAccessUser(user.id, type);
        }
        else {
            return true;
        }
    }
    // ======== CopilotFeature ========
    async addCopilot(userId, reason = 'Copilot plan user') {
        return this.feature.addUserFeature(userId, FeatureType.UnlimitedCopilot, reason);
    }
    async removeCopilot(userId) {
        return this.feature.removeUserFeature(userId, FeatureType.UnlimitedCopilot);
    }
    async isCopilotUser(userId) {
        return await this.feature.hasUserFeature(userId, FeatureType.UnlimitedCopilot);
    }
    // ======== User Feature ========
    async getActivatedUserFeatures(userId) {
        const features = await this.feature.getActivatedUserFeatures(userId);
        return features.map(f => f.feature.name);
    }
    // ======== Workspace Feature ========
    async addWorkspaceFeatures(workspaceId, feature, reason) {
        return this.feature.addWorkspaceFeature(workspaceId, feature, reason || 'add feature by api');
    }
    async getWorkspaceFeatures(workspaceId) {
        const features = await this.feature.getWorkspaceFeatures(workspaceId);
        return features.filter(f => f.activated).map(f => f.feature.name);
    }
    async hasWorkspaceFeature(workspaceId, feature) {
        return this.feature.hasWorkspaceFeature(workspaceId, feature);
    }
    async removeWorkspaceFeature(workspaceId, feature) {
        return this.feature
            .removeWorkspaceFeature(workspaceId, feature)
            .then(c => c > 0);
    }
    async listFeatureWorkspaces(feature) {
        return this.feature.listFeatureWorkspaces(feature);
    }
};
FeatureManagementService = FeatureManagementService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [FeatureService,
        UserService,
        Config])
], FeatureManagementService);
export { FeatureManagementService };
//# sourceMappingURL=management.js.map