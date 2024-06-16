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
import { Args, Field, Mutation, ObjectType, Parent, registerEnumType, ResolveField, Resolver, } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { CurrentUser } from '../../auth';
import { DocID } from '../../utils/doc';
import { PermissionService, PublicPageMode } from '../permission';
import { Permission, WorkspaceType } from '../types';
registerEnumType(PublicPageMode, {
    name: 'PublicPageMode',
    description: 'The mode which the public page default in',
});
let WorkspacePage = class WorkspacePage {
};
__decorate([
    Field(() => String, { name: 'id' }),
    __metadata("design:type", String)
], WorkspacePage.prototype, "pageId", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], WorkspacePage.prototype, "workspaceId", void 0);
__decorate([
    Field(() => PublicPageMode),
    __metadata("design:type", Number)
], WorkspacePage.prototype, "mode", void 0);
__decorate([
    Field(),
    __metadata("design:type", Boolean)
], WorkspacePage.prototype, "public", void 0);
WorkspacePage = __decorate([
    ObjectType()
], WorkspacePage);
let PagePermissionResolver = class PagePermissionResolver {
    constructor(prisma, permission) {
        this.prisma = prisma;
        this.permission = permission;
    }
    /**
     * @deprecated
     */
    async sharedPages(workspace) {
        const data = await this.prisma.workspacePage.findMany({
            where: {
                workspaceId: workspace.id,
                public: true,
            },
        });
        return data.map(row => row.pageId);
    }
    async publicPages(workspace) {
        return this.prisma.workspacePage.findMany({
            where: {
                workspaceId: workspace.id,
                public: true,
            },
        });
    }
    async publicPage(workspace, pageId) {
        return this.prisma.workspacePage.findFirst({
            where: {
                workspaceId: workspace.id,
                pageId,
                public: true,
            },
        });
    }
    /**
     * @deprecated
     */
    async deprecatedSharePage(user, workspaceId, pageId) {
        await this.publishPage(user, workspaceId, pageId, PublicPageMode.Page);
        return true;
    }
    async publishPage(user, workspaceId, pageId, mode) {
        const docId = new DocID(pageId, workspaceId);
        if (docId.isWorkspace) {
            throw new BadRequestException('Expect page not to be workspace');
        }
        await this.permission.checkWorkspace(docId.workspace, user.id, Permission.Read);
        return this.permission.publishPage(docId.workspace, docId.guid, mode);
    }
    /**
     * @deprecated
     */
    async deprecatedRevokePage(user, workspaceId, pageId) {
        await this.revokePublicPage(user, workspaceId, pageId);
        return true;
    }
    async revokePublicPage(user, workspaceId, pageId) {
        const docId = new DocID(pageId, workspaceId);
        if (docId.isWorkspace) {
            throw new BadRequestException('Expect page not to be workspace');
        }
        await this.permission.checkWorkspace(docId.workspace, user.id, Permission.Read);
        const isPublic = await this.permission.isPublicPage(docId.workspace, docId.guid);
        if (!isPublic) {
            throw new BadRequestException('Page is not public');
        }
        return this.permission.revokePublicPage(docId.workspace, docId.guid);
    }
};
__decorate([
    ResolveField(() => [String], {
        description: 'Shared pages of workspace',
        complexity: 2,
        deprecationReason: 'use WorkspaceType.publicPages',
    }),
    __param(0, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType]),
    __metadata("design:returntype", Promise)
], PagePermissionResolver.prototype, "sharedPages", null);
__decorate([
    ResolveField(() => [WorkspacePage], {
        description: 'Public pages of a workspace',
        complexity: 2,
    }),
    __param(0, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType]),
    __metadata("design:returntype", Promise)
], PagePermissionResolver.prototype, "publicPages", null);
__decorate([
    ResolveField(() => WorkspacePage, {
        description: 'Get public page of a workspace by page id.',
        complexity: 2,
        nullable: true,
    }),
    __param(0, Parent()),
    __param(1, Args('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType, String]),
    __metadata("design:returntype", Promise)
], PagePermissionResolver.prototype, "publicPage", null);
__decorate([
    Mutation(() => Boolean, {
        name: 'sharePage',
        deprecationReason: 'renamed to publishPage',
    }),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PagePermissionResolver.prototype, "deprecatedSharePage", null);
__decorate([
    Mutation(() => WorkspacePage),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('pageId')),
    __param(3, Args({
        name: 'mode',
        type: () => PublicPageMode,
        nullable: true,
        defaultValue: PublicPageMode.Page,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number]),
    __metadata("design:returntype", Promise)
], PagePermissionResolver.prototype, "publishPage", null);
__decorate([
    Mutation(() => Boolean, {
        name: 'revokePage',
        deprecationReason: 'use revokePublicPage',
    }),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PagePermissionResolver.prototype, "deprecatedRevokePage", null);
__decorate([
    Mutation(() => WorkspacePage),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PagePermissionResolver.prototype, "revokePublicPage", null);
PagePermissionResolver = __decorate([
    Resolver(() => WorkspaceType),
    __metadata("design:paramtypes", [PrismaClient,
        PermissionService])
], PagePermissionResolver);
export { PagePermissionResolver };
//# sourceMappingURL=page.js.map