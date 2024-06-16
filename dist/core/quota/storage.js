var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var QuotaManagementService_1;
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FeatureService, FeatureType } from '../features';
import { WorkspaceBlobStorage } from '../storage';
import { PermissionService } from '../workspaces/permission';
import { OneGB } from './constant';
import { QuotaService } from './service';
import { formatSize } from './types';
let QuotaManagementService = QuotaManagementService_1 = class QuotaManagementService {
    constructor(feature, quota, permissions, storage) {
        this.feature = feature;
        this.quota = quota;
        this.permissions = permissions;
        this.storage = storage;
        this.logger = new Logger(QuotaManagementService_1.name);
    }
    async getUserQuota(userId) {
        const quota = await this.quota.getUserQuota(userId);
        return {
            name: quota.feature.name,
            reason: quota.reason,
            createAt: quota.createdAt,
            expiredAt: quota.expiredAt,
            blobLimit: quota.feature.blobLimit,
            businessBlobLimit: quota.feature.businessBlobLimit,
            storageQuota: quota.feature.storageQuota,
            historyPeriod: quota.feature.historyPeriod,
            memberLimit: quota.feature.memberLimit,
            copilotActionLimit: quota.feature.copilotActionLimit,
        };
    }
    // TODO: lazy calc, need to be optimized with cache
    async getUserUsage(userId) {
        const workspaces = await this.permissions.getOwnedWorkspaces(userId);
        const sizes = await Promise.allSettled(workspaces.map(workspace => this.storage.totalSize(workspace)));
        return sizes.reduce((total, size) => {
            if (size.status === 'fulfilled') {
                if (Number.isSafeInteger(size.value)) {
                    return total + size.value;
                }
                else {
                    this.logger.error(`Workspace size is invalid: ${size.value}`);
                }
            }
            else {
                this.logger.error(`Failed to get workspace size: ${size.reason}`);
            }
            return total;
        }, 0);
    }
    generateQuotaCalculator(quota, blobLimit, usedSize, unlimited = false) {
        const checkExceeded = (recvSize) => {
            const total = usedSize + recvSize;
            // only skip total storage check if workspace has unlimited feature
            if (total > quota && !unlimited) {
                this.logger.warn(`storage size limit exceeded: ${total} > ${quota}`);
                return true;
            }
            else if (recvSize > blobLimit) {
                this.logger.warn(`blob size limit exceeded: ${recvSize} > ${blobLimit}`);
                return true;
            }
            else {
                return false;
            }
        };
        return checkExceeded;
    }
    async getQuotaCalculator(userId) {
        const quota = await this.getUserQuota(userId);
        const { storageQuota, businessBlobLimit } = quota;
        const usedSize = await this.getUserUsage(userId);
        return this.generateQuotaCalculator(storageQuota, businessBlobLimit, usedSize);
    }
    async getQuotaCalculatorByWorkspace(workspaceId) {
        const { storageQuota, usedSize, businessBlobLimit, unlimited } = await this.getWorkspaceUsage(workspaceId);
        return this.generateQuotaCalculator(storageQuota, businessBlobLimit, usedSize, unlimited);
    }
    // get workspace's owner quota and total size of used
    // quota was apply to owner's account
    async getWorkspaceUsage(workspaceId) {
        const { user: owner } = await this.permissions.getWorkspaceOwner(workspaceId);
        if (!owner)
            throw new NotFoundException('Workspace owner not found');
        const { feature: { name, blobLimit, businessBlobLimit, historyPeriod, memberLimit, storageQuota, copilotActionLimit, humanReadable, }, } = await this.quota.getUserQuota(owner.id);
        // get all workspaces size of owner used
        const usedSize = await this.getUserUsage(owner.id);
        // relax restrictions if workspace has unlimited feature
        // todo(@darkskygit): need a mechanism to allow feature as a middleware to edit quota
        const unlimited = await this.feature.hasWorkspaceFeature(workspaceId, FeatureType.UnlimitedWorkspace);
        const quota = {
            name,
            blobLimit,
            businessBlobLimit,
            historyPeriod,
            memberLimit,
            storageQuota,
            copilotActionLimit,
            humanReadable,
            usedSize,
            unlimited,
        };
        if (quota.unlimited) {
            return this.mergeUnlimitedQuota(quota);
        }
        return quota;
    }
    mergeUnlimitedQuota(orig) {
        return {
            ...orig,
            storageQuota: 1000 * OneGB,
            memberLimit: 1000,
            humanReadable: {
                ...orig.humanReadable,
                name: 'Unlimited',
                storageQuota: formatSize(1000 * OneGB),
                memberLimit: '1000',
            },
        };
    }
    async checkBlobQuota(workspaceId, size) {
        const { storageQuota, usedSize } = await this.getWorkspaceUsage(workspaceId);
        return storageQuota - (size + usedSize);
    }
};
QuotaManagementService = QuotaManagementService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [FeatureService,
        QuotaService,
        PermissionService,
        WorkspaceBlobStorage])
], QuotaManagementService);
export { QuotaManagementService };
//# sourceMappingURL=storage.js.map