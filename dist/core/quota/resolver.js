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
import { Field, ObjectType, registerEnumType, ResolveField, Resolver, } from '@nestjs/graphql';
import { SafeIntResolver } from 'graphql-scalars';
import { CurrentUser } from '../auth/current-user';
import { EarlyAccessType } from '../features';
import { UserType } from '../user';
import { QuotaService } from './service';
registerEnumType(EarlyAccessType, {
    name: 'EarlyAccessType',
});
let UserQuotaHumanReadableType = class UserQuotaHumanReadableType {
};
__decorate([
    Field({ name: 'name' }),
    __metadata("design:type", String)
], UserQuotaHumanReadableType.prototype, "name", void 0);
__decorate([
    Field({ name: 'blobLimit' }),
    __metadata("design:type", String)
], UserQuotaHumanReadableType.prototype, "blobLimit", void 0);
__decorate([
    Field({ name: 'storageQuota' }),
    __metadata("design:type", String)
], UserQuotaHumanReadableType.prototype, "storageQuota", void 0);
__decorate([
    Field({ name: 'historyPeriod' }),
    __metadata("design:type", String)
], UserQuotaHumanReadableType.prototype, "historyPeriod", void 0);
__decorate([
    Field({ name: 'memberLimit' }),
    __metadata("design:type", String)
], UserQuotaHumanReadableType.prototype, "memberLimit", void 0);
UserQuotaHumanReadableType = __decorate([
    ObjectType('UserQuotaHumanReadable')
], UserQuotaHumanReadableType);
let UserQuotaType = class UserQuotaType {
};
__decorate([
    Field({ name: 'name' }),
    __metadata("design:type", String)
], UserQuotaType.prototype, "name", void 0);
__decorate([
    Field(() => SafeIntResolver, { name: 'blobLimit' }),
    __metadata("design:type", Number)
], UserQuotaType.prototype, "blobLimit", void 0);
__decorate([
    Field(() => SafeIntResolver, { name: 'storageQuota' }),
    __metadata("design:type", Number)
], UserQuotaType.prototype, "storageQuota", void 0);
__decorate([
    Field(() => SafeIntResolver, { name: 'historyPeriod' }),
    __metadata("design:type", Number)
], UserQuotaType.prototype, "historyPeriod", void 0);
__decorate([
    Field({ name: 'memberLimit' }),
    __metadata("design:type", Number)
], UserQuotaType.prototype, "memberLimit", void 0);
__decorate([
    Field({ name: 'humanReadable' }),
    __metadata("design:type", UserQuotaHumanReadableType)
], UserQuotaType.prototype, "humanReadable", void 0);
UserQuotaType = __decorate([
    ObjectType('UserQuota')
], UserQuotaType);
let QuotaManagementResolver = class QuotaManagementResolver {
    constructor(quota) {
        this.quota = quota;
    }
    async getQuota(me) {
        const quota = await this.quota.getUserQuota(me.id);
        return quota.feature;
    }
};
__decorate([
    ResolveField(() => UserQuotaType, { name: 'quota', nullable: true }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserType]),
    __metadata("design:returntype", Promise)
], QuotaManagementResolver.prototype, "getQuota", null);
QuotaManagementResolver = __decorate([
    Resolver(() => UserType),
    __metadata("design:paramtypes", [QuotaService])
], QuotaManagementResolver);
export { QuotaManagementResolver };
//# sourceMappingURL=resolver.js.map