import { PrismaClient } from '@prisma/client';
import { CurrentUser } from '../../auth';
import { PermissionService, PublicPageMode } from '../permission';
import { WorkspaceType } from '../types';
export declare class PagePermissionResolver {
    private readonly prisma;
    private readonly permission;
    constructor(prisma: PrismaClient, permission: PermissionService);
    /**
     * @deprecated
     */
    sharedPages(workspace: WorkspaceType): Promise<string[]>;
    publicPages(workspace: WorkspaceType): Promise<{
        workspaceId: string;
        pageId: string;
        public: boolean;
        mode: number;
    }[]>;
    publicPage(workspace: WorkspaceType, pageId: string): Promise<{
        workspaceId: string;
        pageId: string;
        public: boolean;
        mode: number;
    } | null>;
    /**
     * @deprecated
     */
    deprecatedSharePage(user: CurrentUser, workspaceId: string, pageId: string): Promise<boolean>;
    publishPage(user: CurrentUser, workspaceId: string, pageId: string, mode: PublicPageMode): Promise<{
        workspaceId: string;
        pageId: string;
        public: boolean;
        mode: number;
    }>;
    /**
     * @deprecated
     */
    deprecatedRevokePage(user: CurrentUser, workspaceId: string, pageId: string): Promise<boolean>;
    revokePublicPage(user: CurrentUser, workspaceId: string, pageId: string): Promise<{
        workspaceId: string;
        pageId: string;
        public: boolean;
        mode: number;
    }>;
}
//# sourceMappingURL=page.d.ts.map