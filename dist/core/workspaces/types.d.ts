import type { Workspace } from '@prisma/client';
import { UserType } from '../user/types';
export declare enum Permission {
    Read = 0,
    Write = 1,
    Admin = 10,
    Owner = 99
}
declare const InviteUserType_base: import("@nestjs/common").Type<Omit<Partial<UserType>, "id">>;
export declare class InviteUserType extends InviteUserType_base {
    id: string;
    permission: Permission;
    inviteId: string;
    accepted: boolean;
}
export declare class WorkspaceType implements Partial<Workspace> {
    id: string;
    public: boolean;
    createdAt: Date;
    members: InviteUserType[];
}
export declare class InvitationWorkspaceType {
    id: string;
    name: string;
    avatar: string;
}
export declare class WorkspaceBlobSizes {
    size: number;
}
export declare class InvitationType {
    workspace: InvitationWorkspaceType;
    user: UserType;
    invitee: UserType;
}
declare const UpdateWorkspaceInput_base: import("@nestjs/common").Type<Pick<Partial<WorkspaceType>, "public">>;
export declare class UpdateWorkspaceInput extends UpdateWorkspaceInput_base {
    id: string;
}
export {};
//# sourceMappingURL=types.d.ts.map