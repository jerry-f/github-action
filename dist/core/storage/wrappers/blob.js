var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { Cache, Config, EventEmitter, OnEvent, StorageProviderFactory, } from '../../../fundamentals';
let WorkspaceBlobStorage = class WorkspaceBlobStorage {
    constructor(config, event, storageFactory, cache) {
        this.config = config;
        this.event = event;
        this.storageFactory = storageFactory;
        this.cache = cache;
        this.provider = this.storageFactory.create(this.config.storages.blob);
    }
    async put(workspaceId, key, blob) {
        await this.provider.put(`${workspaceId}/${key}`, blob);
        await this.cache.delete(`blob-list:${workspaceId}`);
    }
    async get(workspaceId, key) {
        return this.provider.get(`${workspaceId}/${key}`);
    }
    async list(workspaceId) {
        const cachedList = await this.cache.list(`blob-list:${workspaceId}`, 0, -1);
        if (cachedList.length > 0) {
            return cachedList;
        }
        const blobs = await this.provider.list(workspaceId + '/');
        blobs.forEach(item => {
            // trim workspace prefix
            item.key = item.key.slice(workspaceId.length + 1);
        });
        await this.cache.pushBack(`blob-list:${workspaceId}`, ...blobs);
        return blobs;
    }
    /**
     * we won't really delete the blobs until the doc blobs manager is implemented sounded
     */
    async delete(_workspaceId, _key) {
        // return this.provider.delete(`${workspaceId}/${key}`);
    }
    async totalSize(workspaceId) {
        const blobs = await this.list(workspaceId);
        // how could we ignore the ones get soft-deleted?
        return blobs.reduce((acc, item) => acc + item.size, 0);
    }
    async onWorkspaceDeleted(workspaceId) {
        const blobs = await this.list(workspaceId);
        // to reduce cpu time holding
        blobs.forEach(blob => {
            this.event.emit('workspace.blob.deleted', {
                workspaceId: workspaceId,
                name: blob.key,
            });
        });
    }
    async onDeleteWorkspaceBlob({ workspaceId, name, }) {
        await this.delete(workspaceId, name);
    }
};
__decorate([
    OnEvent('workspace.deleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkspaceBlobStorage.prototype, "onWorkspaceDeleted", null);
__decorate([
    OnEvent('workspace.blob.deleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkspaceBlobStorage.prototype, "onDeleteWorkspaceBlob", null);
WorkspaceBlobStorage = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config,
        EventEmitter,
        StorageProviderFactory,
        Cache])
], WorkspaceBlobStorage);
export { WorkspaceBlobStorage };
//# sourceMappingURL=blob.js.map