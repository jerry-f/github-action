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
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var WorkspaceResolver_1;
import { ForbiddenException, InternalServerErrorException, Logger, NotFoundException, PayloadTooLargeException, } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver, } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { getStreamAsBuffer } from 'get-stream';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { applyUpdate, Doc } from 'yjs';
import { EventEmitter, MailService, MutexService, Throttle, TooManyRequestsException, } from '../../../fundamentals';
import { CurrentUser, Public } from '../../auth';
import { QuotaManagementService, QuotaQueryType } from '../../quota';
import { WorkspaceBlobStorage } from '../../storage';
import { UserService, UserType } from '../../user';
import { PermissionService } from '../permission';
import { InvitationType, InviteUserType, Permission, UpdateWorkspaceInput, WorkspaceType, } from '../types';
import { defaultWorkspaceAvatar } from '../utils';
/**
 * Workspace resolver
 * Public apis rate limit: 10 req/m
 * Other rate limit: 120 req/m
 */
let WorkspaceResolver = WorkspaceResolver_1 = class WorkspaceResolver {
    constructor(mailer, prisma, permissions, quota, users, event, blobStorage, mutex) {
        this.mailer = mailer;
        this.prisma = prisma;
        this.permissions = permissions;
        this.quota = quota;
        this.users = users;
        this.event = event;
        this.blobStorage = blobStorage;
        this.mutex = mutex;
        this.logger = new Logger(WorkspaceResolver_1.name);
    }
    async permission(user, workspace) {
        // may applied in workspaces query
        if ('permission' in workspace) {
            return workspace.permission;
        }
        const permission = await this.permissions.get(workspace.id, user.id);
        if (!permission) {
            throw new ForbiddenException();
        }
        return permission;
    }
    memberCount(workspace) {
        return this.prisma.workspaceUserPermission.count({
            where: {
                workspaceId: workspace.id,
            },
        });
    }
    async owner(workspace) {
        const data = await this.permissions.getWorkspaceOwner(workspace.id);
        return data.user;
    }
    async members(workspace, skip, take) {
        const data = await this.prisma.workspaceUserPermission.findMany({
            where: {
                workspaceId: workspace.id,
            },
            skip,
            take: take || 8,
            orderBy: [
                {
                    createdAt: 'asc',
                },
                {
                    type: 'desc',
                },
            ],
            include: {
                user: true,
            },
        });
        return data
            .filter(({ user }) => !!user)
            .map(({ id, accepted, type, user }) => ({
            ...user,
            permission: type,
            inviteId: id,
            accepted,
        }));
    }
    workspaceQuota(workspace) {
        return this.quota.getWorkspaceUsage(workspace.id);
    }
    async isOwner(user, workspaceId) {
        const data = await this.permissions.tryGetWorkspaceOwner(workspaceId);
        return data?.user?.id === user.id;
    }
    async workspaces(user) {
        const data = await this.prisma.workspaceUserPermission.findMany({
            where: {
                userId: user.id,
                accepted: true,
            },
            include: {
                workspace: true,
            },
        });
        return data.map(({ workspace, type }) => {
            return {
                ...workspace,
                permission: type,
            };
        });
    }
    async workspace(user, id) {
        await this.permissions.checkWorkspace(id, user.id);
        const workspace = await this.prisma.workspace.findUnique({ where: { id } });
        if (!workspace) {
            throw new NotFoundException("Workspace doesn't exist");
        }
        return workspace;
    }
    async createWorkspace(user, init) {
        const workspace = await this.prisma.workspace.create({
            data: {
                public: false,
                permissions: {
                    create: {
                        type: Permission.Owner,
                        userId: user.id,
                        accepted: true,
                    },
                },
            },
        });
        if (init) {
            // convert stream to buffer
            const buffer = await new Promise(resolve => {
                const stream = init.createReadStream();
                const chunks = [];
                stream.on('data', chunk => {
                    chunks.push(chunk);
                });
                stream.on('error', () => {
                    resolve(Buffer.from([]));
                });
                stream.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            });
            if (buffer.length) {
                await this.prisma.snapshot.create({
                    data: {
                        id: workspace.id,
                        workspaceId: workspace.id,
                        blob: buffer,
                        updatedAt: new Date(),
                    },
                });
            }
        }
        return workspace;
    }
    async updateWorkspace(user, { id, ...updates }) {
        await this.permissions.checkWorkspace(id, user.id, Permission.Admin);
        return this.prisma.workspace.update({
            where: {
                id,
            },
            data: updates,
        });
    }
    async deleteWorkspace(user, id) {
        await this.permissions.checkWorkspace(id, user.id, Permission.Owner);
        await this.prisma.workspace.delete({
            where: {
                id,
            },
        });
        this.event.emit('workspace.deleted', id);
        return true;
    }
    async invite(user, workspaceId, email, permission, sendInviteMail) {
        await this.permissions.checkWorkspace(workspaceId, user.id, Permission.Admin);
        if (permission === Permission.Owner) {
            throw new ForbiddenException('Cannot change owner');
        }
        try {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                // lock to prevent concurrent invite
                const lockFlag = `invite:${workspaceId}`;
                const lock = __addDisposableResource(env_1, await this.mutex.lock(lockFlag), true);
                if (!lock) {
                    return new TooManyRequestsException('Server is busy');
                }
                // member limit check
                const [memberCount, quota] = await Promise.all([
                    this.prisma.workspaceUserPermission.count({
                        where: { workspaceId },
                    }),
                    this.quota.getWorkspaceUsage(workspaceId),
                ]);
                if (memberCount >= quota.memberLimit) {
                    return new PayloadTooLargeException('Workspace member limit reached.');
                }
                let target = await this.users.findUserByEmail(email);
                if (target) {
                    const originRecord = await this.prisma.workspaceUserPermission.findFirst({
                        where: {
                            workspaceId,
                            userId: target.id,
                        },
                    });
                    // only invite if the user is not already in the workspace
                    if (originRecord)
                        return originRecord.id;
                }
                else {
                    target = await this.users.createAnonymousUser(email, {
                        registered: false,
                    });
                }
                const inviteId = await this.permissions.grant(workspaceId, target.id, permission);
                if (sendInviteMail) {
                    const inviteInfo = await this.getInviteInfo(inviteId);
                    try {
                        await this.mailer.sendInviteEmail(email, inviteId, {
                            workspace: {
                                id: inviteInfo.workspace.id,
                                name: inviteInfo.workspace.name,
                                avatar: inviteInfo.workspace.avatar,
                            },
                            user: {
                                avatar: inviteInfo.user?.avatarUrl || '',
                                name: inviteInfo.user?.name || '',
                            },
                        });
                    }
                    catch (e) {
                        const ret = await this.permissions.revokeWorkspace(workspaceId, target.id);
                        if (!ret) {
                            this.logger.fatal(`failed to send ${workspaceId} invite email to ${email} and failed to revoke permission: ${inviteId}, ${e}`);
                        }
                        else {
                            this.logger.warn(`failed to send ${workspaceId} invite email to ${email}, but successfully revoked permission: ${e}`);
                        }
                        return new InternalServerErrorException('Failed to send invite email. Please try again.');
                    }
                }
                return inviteId;
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                const result_1 = __disposeResources(env_1);
                if (result_1)
                    await result_1;
            }
        }
        catch (e) {
            this.logger.error('failed to invite user', e);
            return new TooManyRequestsException('Server is busy');
        }
    }
    async getInviteInfo(inviteId) {
        const workspaceId = await this.prisma.workspaceUserPermission
            .findUniqueOrThrow({
            where: {
                id: inviteId,
            },
            select: {
                workspaceId: true,
            },
        })
            .then(({ workspaceId }) => workspaceId);
        const snapshot = await this.prisma.snapshot.findFirstOrThrow({
            where: {
                id: workspaceId,
                workspaceId,
            },
        });
        const doc = new Doc();
        applyUpdate(doc, new Uint8Array(snapshot.blob));
        const metaJSON = doc.getMap('meta').toJSON();
        const owner = await this.permissions.getWorkspaceOwner(workspaceId);
        const invitee = await this.permissions.getWorkspaceInvitation(inviteId, workspaceId);
        let avatar = '';
        if (metaJSON.avatar) {
            const avatarBlob = await this.blobStorage.get(workspaceId, metaJSON.avatar);
            if (avatarBlob.body) {
                avatar = (await getStreamAsBuffer(avatarBlob.body)).toString('base64');
            }
        }
        return {
            workspace: {
                name: metaJSON.name || '',
                avatar: avatar || defaultWorkspaceAvatar,
                id: workspaceId,
            },
            user: owner.user,
            invitee: invitee.user,
        };
    }
    async revoke(user, workspaceId, userId) {
        await this.permissions.checkWorkspace(workspaceId, user.id, Permission.Admin);
        return this.permissions.revokeWorkspace(workspaceId, userId);
    }
    async acceptInviteById(workspaceId, inviteId, sendAcceptMail) {
        const { invitee, user: inviter, workspace, } = await this.getInviteInfo(inviteId);
        if (!inviter || !invitee) {
            throw new ForbiddenException(`can not find inviter/invitee by inviteId: ${inviteId}`);
        }
        if (sendAcceptMail) {
            await this.mailer.sendAcceptedEmail(inviter.email, {
                inviteeName: invitee.name,
                workspaceName: workspace.name,
            });
        }
        return this.permissions.acceptWorkspaceInvitation(inviteId, workspaceId);
    }
    async leaveWorkspace(user, workspaceId, workspaceName, sendLeaveMail) {
        await this.permissions.checkWorkspace(workspaceId, user.id);
        const owner = await this.permissions.getWorkspaceOwner(workspaceId);
        if (!owner.user) {
            throw new ForbiddenException(`can not find owner by workspaceId: ${workspaceId}`);
        }
        if (sendLeaveMail) {
            await this.mailer.sendLeaveWorkspaceEmail(owner.user.email, {
                workspaceName,
                inviteeName: user.name,
            });
        }
        return this.permissions.revokeWorkspace(workspaceId, user.id);
    }
};
__decorate([
    ResolveField(() => Permission, {
        description: 'Permission of current signed in user in workspace',
        complexity: 2,
    }),
    __param(0, CurrentUser()),
    __param(1, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, WorkspaceType]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "permission", null);
__decorate([
    ResolveField(() => Int, {
        description: 'member count of workspace',
        complexity: 2,
    }),
    __param(0, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType]),
    __metadata("design:returntype", void 0)
], WorkspaceResolver.prototype, "memberCount", null);
__decorate([
    ResolveField(() => UserType, {
        description: 'Owner of workspace',
        complexity: 2,
    }),
    __param(0, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "owner", null);
__decorate([
    ResolveField(() => [InviteUserType], {
        description: 'Members of workspace',
        complexity: 2,
    }),
    __param(0, Parent()),
    __param(1, Args('skip', { type: () => Int, nullable: true })),
    __param(2, Args('take', { type: () => Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType, Number, Number]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "members", null);
__decorate([
    ResolveField(() => QuotaQueryType, {
        name: 'quota',
        description: 'quota of workspace',
        complexity: 2,
    }),
    __param(0, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType]),
    __metadata("design:returntype", void 0)
], WorkspaceResolver.prototype, "workspaceQuota", null);
__decorate([
    Query(() => Boolean, {
        description: 'Get is owner of workspace',
        complexity: 2,
    }),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "isOwner", null);
__decorate([
    Query(() => [WorkspaceType], {
        description: 'Get all accessible workspaces for current user',
        complexity: 2,
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "workspaces", null);
__decorate([
    Query(() => WorkspaceType, {
        description: 'Get workspace by id',
    }),
    __param(0, CurrentUser()),
    __param(1, Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "workspace", null);
__decorate([
    Mutation(() => WorkspaceType, {
        description: 'Create a new workspace',
    }),
    __param(0, CurrentUser()),
    __param(1, Args({ name: 'init', type: () => GraphQLUpload, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "createWorkspace", null);
__decorate([
    Mutation(() => WorkspaceType, {
        description: 'Update workspace',
    }),
    __param(0, CurrentUser()),
    __param(1, Args({ name: 'input', type: () => UpdateWorkspaceInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateWorkspaceInput]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "updateWorkspace", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "deleteWorkspace", null);
__decorate([
    Mutation(() => String),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('email')),
    __param(3, Args('permission', { type: () => Permission })),
    __param(4, Args('sendInviteMail', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Boolean]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "invite", null);
__decorate([
    Throttle('strict'),
    Public(),
    Query(() => InvitationType, {
        description: 'send workspace invitation',
    }),
    __param(0, Args('inviteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "getInviteInfo", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "revoke", null);
__decorate([
    Mutation(() => Boolean),
    Public(),
    __param(0, Args('workspaceId')),
    __param(1, Args('inviteId')),
    __param(2, Args('sendAcceptMail', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "acceptInviteById", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('workspaceName')),
    __param(3, Args('sendLeaveMail', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], WorkspaceResolver.prototype, "leaveWorkspace", null);
WorkspaceResolver = WorkspaceResolver_1 = __decorate([
    Resolver(() => WorkspaceType),
    __metadata("design:paramtypes", [MailService,
        PrismaClient,
        PermissionService,
        QuotaManagementService,
        UserService,
        EventEmitter,
        WorkspaceBlobStorage,
        MutexService])
], WorkspaceResolver);
export { WorkspaceResolver };
//# sourceMappingURL=workspace.js.map