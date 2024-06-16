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
var WorkspacesController_1;
import { Controller, ForbiddenException, Get, Logger, NotFoundException, Param, Res, } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CallTimer } from '../../fundamentals';
import { CurrentUser, Public } from '../auth';
import { DocHistoryManager, DocManager } from '../doc';
import { WorkspaceBlobStorage } from '../storage';
import { DocID } from '../utils/doc';
import { PermissionService, PublicPageMode } from './permission';
import { Permission } from './types';
let WorkspacesController = WorkspacesController_1 = class WorkspacesController {
    constructor(storage, permission, docManager, historyManager, prisma) {
        this.storage = storage;
        this.permission = permission;
        this.docManager = docManager;
        this.historyManager = historyManager;
        this.prisma = prisma;
        this.logger = new Logger(WorkspacesController_1.name);
    }
    // get workspace blob
    //
    // NOTE: because graphql can't represent a File, so we have to use REST API to get blob
    async blob(user, workspaceId, name, res) {
        // if workspace is public or have any public page, then allow to access
        // otherwise, check permission
        if (!(await this.permission.isPublicAccessible(workspaceId, workspaceId, user?.id))) {
            throw new ForbiddenException('Permission denied');
        }
        const { body, metadata } = await this.storage.get(workspaceId, name);
        if (!body) {
            throw new NotFoundException(`Blob not found in workspace ${workspaceId}: ${name}`);
        }
        // metadata should always exists if body is not null
        if (metadata) {
            res.setHeader('content-type', metadata.contentType);
            res.setHeader('last-modified', metadata.lastModified.toUTCString());
            res.setHeader('content-length', metadata.contentLength);
        }
        else {
            this.logger.warn(`Blob ${workspaceId}/${name} has no metadata`);
        }
        res.setHeader('cache-control', 'public, max-age=2592000, immutable');
        body.pipe(res);
    }
    // get doc binary
    async doc(user, ws, guid, res) {
        const docId = new DocID(guid, ws);
        if (
        // if a user has the permission
        !(await this.permission.isPublicAccessible(docId.workspace, docId.guid, user?.id))) {
            throw new ForbiddenException('Permission denied');
        }
        const binResponse = await this.docManager.getBinary(docId.workspace, docId.guid);
        if (!binResponse) {
            throw new NotFoundException('Doc not found');
        }
        if (!docId.isWorkspace) {
            // fetch the publish page mode for publish page
            const publishPage = await this.prisma.workspacePage.findUnique({
                where: {
                    workspaceId_pageId: {
                        workspaceId: docId.workspace,
                        pageId: docId.guid,
                    },
                },
            });
            const publishPageMode = publishPage?.mode === PublicPageMode.Edgeless ? 'edgeless' : 'page';
            res.setHeader('publish-mode', publishPageMode);
        }
        res.setHeader('content-type', 'application/octet-stream');
        res.send(binResponse.binary);
    }
    async history(user, ws, guid, timestamp, res) {
        const docId = new DocID(guid, ws);
        let ts;
        try {
            ts = new Date(timestamp);
        }
        catch (e) {
            throw new Error('Invalid timestamp');
        }
        await this.permission.checkPagePermission(docId.workspace, docId.guid, user.id, Permission.Write);
        const history = await this.historyManager.get(docId.workspace, docId.guid, ts);
        if (history) {
            res.setHeader('content-type', 'application/octet-stream');
            res.setHeader('cache-control', 'private, max-age=2592000, immutable');
            res.send(history.blob);
        }
        else {
            throw new NotFoundException('Doc history not found');
        }
    }
};
__decorate([
    Public(),
    Get('/:id/blobs/:name'),
    CallTimer('controllers', 'workspace_get_blob'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Param('name')),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "blob", null);
__decorate([
    Public(),
    Get('/:id/docs/:guid'),
    CallTimer('controllers', 'workspace_get_doc'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Param('guid')),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "doc", null);
__decorate([
    Get('/:id/docs/:guid/histories/:timestamp'),
    CallTimer('controllers', 'workspace_get_history'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Param('guid')),
    __param(3, Param('timestamp')),
    __param(4, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "history", null);
WorkspacesController = WorkspacesController_1 = __decorate([
    Controller('/api/workspaces'),
    __metadata("design:paramtypes", [WorkspaceBlobStorage,
        PermissionService,
        DocManager,
        DocHistoryManager,
        PrismaClient])
], WorkspacesController);
export { WorkspacesController };
//# sourceMappingURL=controller.js.map