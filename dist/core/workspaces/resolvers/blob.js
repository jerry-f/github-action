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
var WorkspaceBlobResolver_1;
import { Logger, PayloadTooLargeException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, } from '@nestjs/graphql';
import { SafeIntResolver } from 'graphql-scalars';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { CloudThrottlerGuard, MakeCache, PreventCache, } from '../../../fundamentals';
import { CurrentUser } from '../../auth';
import { QuotaManagementService } from '../../quota';
import { WorkspaceBlobStorage } from '../../storage';
import { PermissionService } from '../permission';
import { Permission, WorkspaceBlobSizes, WorkspaceType } from '../types';
let WorkspaceBlobResolver = WorkspaceBlobResolver_1 = class WorkspaceBlobResolver {
    constructor(permissions, quota, storage) {
        this.permissions = permissions;
        this.quota = quota;
        this.storage = storage;
        this.logger = new Logger(WorkspaceBlobResolver_1.name);
    }
    async blobs(user, workspace) {
        await this.permissions.checkWorkspace(workspace.id, user.id);
        return this.storage
            .list(workspace.id)
            .then(list => list.map(item => item.key));
    }
    async blobsSize(workspace) {
        return this.storage.totalSize(workspace.id);
    }
    /**
     * @deprecated use `workspace.blobs` instead
     */
    async listBlobs(user, workspaceId) {
        await this.permissions.checkWorkspace(workspaceId, user.id);
        return this.storage
            .list(workspaceId)
            .then(list => list.map(item => item.key));
    }
    /**
     * @deprecated use `user.storageUsage` instead
     */
    async collectAllBlobSizes(user) {
        const size = await this.quota.getUserUsage(user.id);
        return { size };
    }
    /**
     * @deprecated mutation `setBlob` will check blob limit & quota usage
     */
    async checkBlobSize(user, workspaceId, blobSize) {
        const canWrite = await this.permissions.tryCheckWorkspace(workspaceId, user.id, Permission.Write);
        if (canWrite) {
            const size = await this.quota.checkBlobQuota(workspaceId, blobSize);
            return { size };
        }
        return false;
    }
    async setBlob(user, workspaceId, blob) {
        await this.permissions.checkWorkspace(workspaceId, user.id, Permission.Write);
        const checkExceeded = await this.quota.getQuotaCalculatorByWorkspace(workspaceId);
        if (checkExceeded(0)) {
            throw new PayloadTooLargeException('Storage or blob size limit exceeded.');
        }
        const buffer = await new Promise((resolve, reject) => {
            const stream = blob.createReadStream();
            const chunks = [];
            stream.on('data', chunk => {
                chunks.push(chunk);
                // check size after receive each chunk to avoid unnecessary memory usage
                const bufferSize = chunks.reduce((acc, cur) => acc + cur.length, 0);
                if (checkExceeded(bufferSize)) {
                    reject(new PayloadTooLargeException('Storage or blob size limit exceeded.'));
                }
            });
            stream.on('error', reject);
            stream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                if (checkExceeded(buffer.length)) {
                    reject(new PayloadTooLargeException('Storage limit exceeded.'));
                }
                else {
                    resolve(buffer);
                }
            });
        });
        await this.storage.put(workspaceId, blob.filename, buffer);
        return blob.filename;
    }
    async deleteBlob(user, workspaceId, name) {
        await this.permissions.checkWorkspace(workspaceId, user.id);
        await this.storage.delete(workspaceId, name);
        return true;
    }
};
__decorate([
    ResolveField(() => [String], {
        description: 'List blobs of workspace',
        complexity: 2,
    }),
    __param(0, CurrentUser()),
    __param(1, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, WorkspaceType]),
    __metadata("design:returntype", Promise)
], WorkspaceBlobResolver.prototype, "blobs", null);
__decorate([
    ResolveField(() => Int, {
        description: 'Blobs size of workspace',
        complexity: 2,
    }),
    __param(0, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType]),
    __metadata("design:returntype", Promise)
], WorkspaceBlobResolver.prototype, "blobsSize", null);
__decorate([
    Query(() => [String], {
        description: 'List blobs of workspace',
        deprecationReason: 'use `workspace.blobs` instead',
    }),
    MakeCache(['blobs'], ['workspaceId']),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkspaceBlobResolver.prototype, "listBlobs", null);
__decorate([
    Query(() => WorkspaceBlobSizes, {
        deprecationReason: 'use `user.storageUsage` instead',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkspaceBlobResolver.prototype, "collectAllBlobSizes", null);
__decorate([
    Query(() => WorkspaceBlobSizes, {
        deprecationReason: 'no more needed',
    }),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('size', { type: () => SafeIntResolver })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], WorkspaceBlobResolver.prototype, "checkBlobSize", null);
__decorate([
    Mutation(() => String),
    PreventCache(['blobs'], ['workspaceId']),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args({ name: 'blob', type: () => GraphQLUpload })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WorkspaceBlobResolver.prototype, "setBlob", null);
__decorate([
    Mutation(() => Boolean),
    PreventCache(['blobs'], ['workspaceId']),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WorkspaceBlobResolver.prototype, "deleteBlob", null);
WorkspaceBlobResolver = WorkspaceBlobResolver_1 = __decorate([
    UseGuards(CloudThrottlerGuard),
    Resolver(() => WorkspaceType),
    __metadata("design:paramtypes", [PermissionService,
        QuotaManagementService,
        WorkspaceBlobStorage])
], WorkspaceBlobResolver);
export { WorkspaceBlobResolver };
//# sourceMappingURL=blob.js.map