var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { DocModule } from '../doc';
import { FeatureModule } from '../features';
import { QuotaModule } from '../quota';
import { StorageModule } from '../storage';
import { UserModule } from '../user';
import { WorkspacesController } from './controller';
import { WorkspaceManagementResolver } from './management';
import { PermissionService } from './permission';
import { DocHistoryResolver, PagePermissionResolver, WorkspaceBlobResolver, WorkspaceResolver, } from './resolvers';
let WorkspaceModule = class WorkspaceModule {
};
WorkspaceModule = __decorate([
    Module({
        imports: [DocModule, FeatureModule, QuotaModule, StorageModule, UserModule],
        controllers: [WorkspacesController],
        providers: [
            WorkspaceResolver,
            WorkspaceManagementResolver,
            PermissionService,
            PagePermissionResolver,
            DocHistoryResolver,
            WorkspaceBlobResolver,
        ],
        exports: [PermissionService],
    })
], WorkspaceModule);
export { WorkspaceModule };
//# sourceMappingURL=index.js.map