var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { UserModule } from '../user';
import { EarlyAccessType, FeatureManagementService } from './management';
import { FeatureManagementResolver } from './resolver';
import { FeatureService } from './service';
/**
 * Feature module provider pre-user feature flag management.
 * includes:
 * - feature query/update/permit
 * - feature statistics
 */
let FeatureModule = class FeatureModule {
};
FeatureModule = __decorate([
    Module({
        imports: [UserModule],
        providers: [
            FeatureService,
            FeatureManagementService,
            FeatureManagementResolver,
        ],
        exports: [FeatureService, FeatureManagementService],
    })
], FeatureModule);
export { FeatureModule };
export { commonFeatureSchema, FeatureKind, Features, FeatureType, } from './types';
export { EarlyAccessType, FeatureManagementService, FeatureService };
//# sourceMappingURL=index.js.map