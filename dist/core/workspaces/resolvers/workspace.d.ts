import { InternalServerErrorException, PayloadTooLargeException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { FileUpload } from '../../../fundamentals';
import { EventEmitter, MailService, MutexService, TooManyRequestsException } from '../../../fundamentals';
import { CurrentUser } from '../../auth';
import { QuotaManagementService, QuotaQueryType } from '../../quota';
import { WorkspaceBlobStorage } from '../../storage';
import { UserService } from '../../user';
import { PermissionService } from '../permission';
import { Permission, UpdateWorkspaceInput, WorkspaceType } from '../types';
/**
 * Workspace resolver
 * Public apis rate limit: 10 req/m
 * Other rate limit: 120 req/m
 */
export declare class WorkspaceResolver {
    private readonly mailer;
    private readonly prisma;
    private readonly permissions;
    private readonly quota;
    private readonly users;
    private readonly event;
    private readonly blobStorage;
    private readonly mutex;
    private readonly logger;
    constructor(mailer: MailService, prisma: PrismaClient, permissions: PermissionService, quota: QuotaManagementService, users: UserService, event: EventEmitter, blobStorage: WorkspaceBlobStorage, mutex: MutexService);
    permission(user: CurrentUser, workspace: WorkspaceType): Promise<unknown>;
    memberCount(workspace: WorkspaceType): import(".prisma/client").Prisma.PrismaPromise<number>;
    owner(workspace: WorkspaceType): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        password: string | null;
        registered: boolean;
    }>;
    members(workspace: WorkspaceType, skip?: number, take?: number): Promise<{
        permission: number;
        inviteId: string;
        accepted: boolean;
        id: string;
        name: string;
        email: string;
        emailVerifiedAt: Date | null;
        avatarUrl: string | null;
        createdAt: Date;
        password: string | null;
        registered: boolean;
    }[]>;
    workspaceQuota(workspace: WorkspaceType): Promise<QuotaQueryType & {
        businessBlobLimit: number;
        unlimited: boolean;
    }>;
    isOwner(user: CurrentUser, workspaceId: string): Promise<boolean>;
    workspaces(user: CurrentUser): Promise<{
        permission: number;
        id: string;
        public: boolean;
        createdAt: Date;
    }[]>;
    workspace(user: CurrentUser, id: string): Promise<{
        id: string;
        public: boolean;
        createdAt: Date;
    }>;
    createWorkspace(user: CurrentUser, init: FileUpload | null): Promise<{
        id: string;
        public: boolean;
        createdAt: Date;
    }>;
    updateWorkspace(user: CurrentUser, { id, ...updates }: UpdateWorkspaceInput): Promise<{
        id: string;
        public: boolean;
        createdAt: Date;
    }>;
    deleteWorkspace(user: CurrentUser, id: string): Promise<boolean>;
    invite(user: CurrentUser, workspaceId: string, email: string, permission: Permission, sendInviteMail: boolean): Promise<string | TooManyRequestsException | PayloadTooLargeException | InternalServerErrorException>;
    getInviteInfo(inviteId: string): Promise<{
        workspace: {
            name: any;
            avatar: string;
            id: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
            emailVerifiedAt: Date | null;
            avatarUrl: string | null;
            createdAt: Date;
            password: string | null;
            registered: boolean;
        };
        invitee: {
            id: string;
            name: string;
            email: string;
            emailVerifiedAt: Date | null;
            avatarUrl: string | null;
            createdAt: Date;
            password: string | null;
            registered: boolean;
        };
    }>;
    revoke(user: CurrentUser, workspaceId: string, userId: string): Promise<boolean>;
    acceptInviteById(workspaceId: string, inviteId: string, sendAcceptMail: boolean): Promise<boolean>;
    leaveWorkspace(user: CurrentUser, workspaceId: string, workspaceName: string, sendLeaveMail: boolean): Promise<boolean>;
}
//# sourceMappingURL=workspace.d.ts.map