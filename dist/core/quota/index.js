var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { FeatureModule } from '../features';
import { StorageModule } from '../storage';
import { PermissionService } from '../workspaces/permission';
import { QuotaManagementResolver } from './resolver';
import { QuotaService } from './service';
import { QuotaManagementService } from './storage';
/**
 * Quota module provider pre-user quota management.
 * includes:
 * - quota query/update/permit
 * - quota statistics
 */
let QuotaModule = class QuotaModule {
};
QuotaModule = __decorate([
    Module({
        imports: [FeatureModule, StorageModule],
        providers: [
            PermissionService,
            QuotaService,
            QuotaManagementResolver,
            QuotaManagementService,
        ],
        exports: [QuotaService, QuotaManagementService],
    })
], QuotaModule);
export { QuotaModule };
export { QuotaManagementService, QuotaService };
export { Quota_FreePlanV1_1, Quota_ProPlanV1 } from './schema';
export { QuotaQueryType, QuotaType } from './types';
//# sourceMappingURL=index.js.map