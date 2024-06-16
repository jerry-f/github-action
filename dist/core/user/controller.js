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
import { Controller, ForbiddenException, Get, NotFoundException, Param, Res, } from '@nestjs/common';
import { AvatarStorage } from '../storage';
let UserAvatarController = class UserAvatarController {
    constructor(storage) {
        this.storage = storage;
    }
    async getAvatar(res, id) {
        if (this.storage.provider.type !== 'fs') {
            throw new ForbiddenException('Only available when avatar storage provider set to fs.');
        }
        const { body, metadata } = await this.storage.get(id);
        if (!body) {
            throw new NotFoundException(`Avatar ${id} not found.`);
        }
        // metadata should always exists if body is not null
        if (metadata) {
            res.setHeader('content-type', metadata.contentType);
            res.setHeader('last-modified', metadata.lastModified.toISOString());
            res.setHeader('content-length', metadata.contentLength);
        }
        body.pipe(res);
    }
};
__decorate([
    Get('/:id'),
    __param(0, Res()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserAvatarController.prototype, "getAvatar", null);
UserAvatarController = __decorate([
    Controller('/api/avatars'),
    __metadata("design:paramtypes", [AvatarStorage])
], UserAvatarController);
export { UserAvatarController };
//# sourceMappingURL=controller.js.map