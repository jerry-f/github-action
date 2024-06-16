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
import { Args, Field, GraphQLISODateTime, Int, Mutation, ObjectType, Parent, ResolveField, Resolver, } from '@nestjs/graphql';
import { CurrentUser } from '../../auth';
import { DocHistoryManager } from '../../doc';
import { DocID } from '../../utils/doc';
import { PermissionService } from '../permission';
import { Permission, WorkspaceType } from '../types';
let DocHistoryType = class DocHistoryType {
};
__decorate([
    Field(),
    __metadata("design:type", String)
], DocHistoryType.prototype, "workspaceId", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], DocHistoryType.prototype, "id", void 0);
__decorate([
    Field(() => GraphQLISODateTime),
    __metadata("design:type", Date)
], DocHistoryType.prototype, "timestamp", void 0);
DocHistoryType = __decorate([
    ObjectType()
], DocHistoryType);
let DocHistoryResolver = class DocHistoryResolver {
    constructor(historyManager, permission) {
        this.historyManager = historyManager;
        this.permission = permission;
    }
    async histories(workspace, guid, timestamp = new Date(), take) {
        const docId = new DocID(guid, workspace.id);
        if (docId.isWorkspace) {
            throw new Error('Invalid guid for listing doc histories.');
        }
        return this.historyManager
            .list(workspace.id, docId.guid, timestamp, take)
            .then(rows => rows.map(({ timestamp }) => {
            return {
                workspaceId: workspace.id,
                id: docId.guid,
                timestamp,
            };
        }));
    }
    async recoverDoc(user, workspaceId, guid, timestamp) {
        const docId = new DocID(guid, workspaceId);
        if (docId.isWorkspace) {
            throw new Error('Invalid guid for recovering doc from history.');
        }
        await this.permission.checkPagePermission(docId.workspace, docId.guid, user.id, Permission.Write);
        return this.historyManager.recover(docId.workspace, docId.guid, timestamp);
    }
};
__decorate([
    ResolveField(() => [DocHistoryType]),
    __param(0, Parent()),
    __param(1, Args('guid')),
    __param(2, Args({ name: 'before', type: () => GraphQLISODateTime, nullable: true })),
    __param(3, Args({ name: 'take', type: () => Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WorkspaceType, String, Date, Number]),
    __metadata("design:returntype", Promise)
], DocHistoryResolver.prototype, "histories", null);
__decorate([
    Mutation(() => Date),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId')),
    __param(2, Args('guid')),
    __param(3, Args({ name: 'timestamp', type: () => GraphQLISODateTime })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Date]),
    __metadata("design:returntype", Promise)
], DocHistoryResolver.prototype, "recoverDoc", null);
DocHistoryResolver = __decorate([
    Resolver(() => WorkspaceType),
    __metadata("design:paramtypes", [DocHistoryManager,
        PermissionService])
], DocHistoryResolver);
export { DocHistoryResolver };
//# sourceMappingURL=history.js.map