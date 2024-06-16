var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { createHash } from 'node:crypto';
import { Injectable, PayloadTooLargeException } from '@nestjs/common';
import { QuotaManagementService } from '../../core/quota';
import { Config, StorageProviderFactory, URLHelper, } from '../../fundamentals';
let CopilotStorage = class CopilotStorage {
    constructor(config, url, storageFactory, quota) {
        this.config = config;
        this.url = url;
        this.storageFactory = storageFactory;
        this.quota = quota;
        this.provider = this.storageFactory.create(this.config.plugins.copilot.storage);
    }
    async put(userId, workspaceId, key, blob) {
        const name = `${userId}/${workspaceId}/${key}`;
        await this.provider.put(name, blob);
        if (this.config.node.dev) {
            // return image base64url for dev environment
            return `data:image/png;base64,${blob.toString('base64')}`;
        }
        return this.url.link(`/api/copilot/blob/${name}`);
    }
    async get(userId, workspaceId, key) {
        return this.provider.get(`${userId}/${workspaceId}/${key}`);
    }
    async delete(userId, workspaceId, key) {
        return this.provider.delete(`${userId}/${workspaceId}/${key}`);
    }
    async handleUpload(userId, blob) {
        const checkExceeded = await this.quota.getQuotaCalculator(userId);
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
        return {
            buffer,
            filename: blob.filename,
        };
    }
    async handleRemoteLink(userId, workspaceId, link) {
        const response = await fetch(link);
        const buffer = new Uint8Array(await response.arrayBuffer());
        const filename = createHash('sha256').update(buffer).digest('base64url');
        return this.put(userId, workspaceId, filename, Buffer.from(buffer));
    }
};
CopilotStorage = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config,
        URLHelper,
        StorageProviderFactory,
        QuotaManagementService])
], CopilotStorage);
export { CopilotStorage };
//# sourceMappingURL=storage.js.map