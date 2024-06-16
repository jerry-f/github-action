var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ID, InputType, ObjectType, OmitType, PartialType, PickType, registerEnumType, } from '@nestjs/graphql';
import { SafeIntResolver } from 'graphql-scalars';
import { UserType } from '../user/types';
export var Permission;
(function (Permission) {
    Permission[Permission["Read"] = 0] = "Read";
    Permission[Permission["Write"] = 1] = "Write";
    Permission[Permission["Admin"] = 10] = "Admin";
    Permission[Permission["Owner"] = 99] = "Owner";
})(Permission || (Permission = {}));
registerEnumType(Permission, {
    name: 'Permission',
    description: 'User permission in workspace',
});
let InviteUserType = class InviteUserType extends OmitType(PartialType(UserType), ['id'], ObjectType) {
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], InviteUserType.prototype, "id", void 0);
__decorate([
    Field(() => Permission, { description: 'User permission in workspace' }),
    __metadata("design:type", Number)
], InviteUserType.prototype, "permission", void 0);
__decorate([
    Field({ description: 'Invite id' }),
    __metadata("design:type", String)
], InviteUserType.prototype, "inviteId", void 0);
__decorate([
    Field({ description: 'User accepted' }),
    __metadata("design:type", Boolean)
], InviteUserType.prototype, "accepted", void 0);
InviteUserType = __decorate([
    ObjectType()
], InviteUserType);
export { InviteUserType };
let WorkspaceType = class WorkspaceType {
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], WorkspaceType.prototype, "id", void 0);
__decorate([
    Field({ description: 'is Public workspace' }),
    __metadata("design:type", Boolean)
], WorkspaceType.prototype, "public", void 0);
__decorate([
    Field({ description: 'Workspace created date' }),
    __metadata("design:type", Date)
], WorkspaceType.prototype, "createdAt", void 0);
__decorate([
    Field(() => [InviteUserType], {
        description: 'Members of workspace',
    }),
    __metadata("design:type", Array)
], WorkspaceType.prototype, "members", void 0);
WorkspaceType = __decorate([
    ObjectType()
], WorkspaceType);
export { WorkspaceType };
let InvitationWorkspaceType = class InvitationWorkspaceType {
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], InvitationWorkspaceType.prototype, "id", void 0);
__decorate([
    Field({ description: 'Workspace name' }),
    __metadata("design:type", String)
], InvitationWorkspaceType.prototype, "name", void 0);
__decorate([
    Field(() => String, {
        // nullable: true,
        description: 'Base64 encoded avatar',
    }),
    __metadata("design:type", String)
], InvitationWorkspaceType.prototype, "avatar", void 0);
InvitationWorkspaceType = __decorate([
    ObjectType()
], InvitationWorkspaceType);
export { InvitationWorkspaceType };
let WorkspaceBlobSizes = class WorkspaceBlobSizes {
};
__decorate([
    Field(() => SafeIntResolver),
    __metadata("design:type", Number)
], WorkspaceBlobSizes.prototype, "size", void 0);
WorkspaceBlobSizes = __decorate([
    ObjectType()
], WorkspaceBlobSizes);
export { WorkspaceBlobSizes };
let InvitationType = class InvitationType {
};
__decorate([
    Field({ description: 'Workspace information' }),
    __metadata("design:type", InvitationWorkspaceType)
], InvitationType.prototype, "workspace", void 0);
__decorate([
    Field({ description: 'User information' }),
    __metadata("design:type", UserType)
], InvitationType.prototype, "user", void 0);
__decorate([
    Field({ description: 'Invitee information' }),
    __metadata("design:type", UserType)
], InvitationType.prototype, "invitee", void 0);
InvitationType = __decorate([
    ObjectType()
], InvitationType);
export { InvitationType };
let UpdateWorkspaceInput = class UpdateWorkspaceInput extends PickType(PartialType(WorkspaceType), ['public'], InputType) {
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], UpdateWorkspaceInput.prototype, "id", void 0);
UpdateWorkspaceInput = __decorate([
    InputType()
], UpdateWorkspaceInput);
export { UpdateWorkspaceInput };
//# sourceMappingURL=types.js.map