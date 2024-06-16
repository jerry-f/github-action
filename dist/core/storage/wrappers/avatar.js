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
import { Config, OnEvent, StorageProviderFactory, URLHelper, } from '../../../fundamentals';
let AvatarStorage = class AvatarStorage {
    constructor(config, url, storageFactory) {
        this.config = config;
        this.url = url;
        this.storageFactory = storageFactory;
        this.storageConfig = this.config.storages.avatar;
        this.provider = this.storageFactory.create(this.storageConfig);
    }
    async put(key, blob, metadata) {
        await this.provider.put(key, blob, metadata);
        let link = this.storageConfig.publicLinkFactory(key);
        if (link.startsWith('/')) {
            link = this.url.link(link);
        }
        return link;
    }
    get(key) {
        return this.provider.get(key);
    }
    delete(key) {
        return this.provider.delete(key);
    }
    async onUserDeleted(user) {
        if (user.avatarUrl) {
            await this.delete(user.avatarUrl);
        }
    }
};
__decorate([
    OnEvent('user.deleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvatarStorage.prototype, "onUserDeleted", null);
AvatarStorage = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config,
        URLHelper,
        StorageProviderFactory])
], AvatarStorage);
export { AvatarStorage };
//# sourceMappingURL=avatar.js.map