var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ObjectType } from '@nestjs/graphql';
import { SafeIntResolver } from 'graphql-scalars';
import { z } from 'zod';
import { commonFeatureSchema, FeatureKind } from '../features/types';
import { ByteUnit, OneDay, OneKB } from './constant';
/// ======== quota define ========
/**
 * naming rule:
 * we append Vx to the end of the feature name to indicate the version of the feature
 * x is a number, start from 1, this number will be change only at the time we change the schema of config
 * for example, we change the value of `blobLimit` from 10MB to 100MB, then we will only change `version` field from 1 to 2
 * but if we remove the `blobLimit` field or rename it, then we will change the Vx to Vx+1
 */
export var QuotaType;
(function (QuotaType) {
    QuotaType["FreePlanV1"] = "free_plan_v1";
    QuotaType["ProPlanV1"] = "pro_plan_v1";
    // only for test, smaller quota
    QuotaType["RestrictedPlanV1"] = "restricted_plan_v1";
})(QuotaType || (QuotaType = {}));
const quotaPlan = z.object({
    feature: z.enum([
        QuotaType.FreePlanV1,
        QuotaType.ProPlanV1,
        QuotaType.RestrictedPlanV1,
    ]),
    configs: z.object({
        name: z.string(),
        blobLimit: z.number().positive().int(),
        storageQuota: z.number().positive().int(),
        historyPeriod: z.number().positive().int(),
        memberLimit: z.number().positive().int(),
        businessBlobLimit: z.number().positive().int().nullish(),
        copilotActionLimit: z.number().positive().int().nullish(),
    }),
});
/// ======== schema infer ========
export const QuotaSchema = commonFeatureSchema
    .extend({
    type: z.literal(FeatureKind.Quota),
})
    .and(z.discriminatedUnion('feature', [quotaPlan]));
/// ======== query types ========
let HumanReadableQuotaType = class HumanReadableQuotaType {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], HumanReadableQuotaType.prototype, "name", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], HumanReadableQuotaType.prototype, "blobLimit", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], HumanReadableQuotaType.prototype, "storageQuota", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], HumanReadableQuotaType.prototype, "historyPeriod", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], HumanReadableQuotaType.prototype, "memberLimit", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], HumanReadableQuotaType.prototype, "copilotActionLimit", void 0);
HumanReadableQuotaType = __decorate([
    ObjectType()
], HumanReadableQuotaType);
export { HumanReadableQuotaType };
let QuotaQueryType = class QuotaQueryType {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], QuotaQueryType.prototype, "name", void 0);
__decorate([
    Field(() => SafeIntResolver),
    __metadata("design:type", Number)
], QuotaQueryType.prototype, "blobLimit", void 0);
__decorate([
    Field(() => SafeIntResolver),
    __metadata("design:type", Number)
], QuotaQueryType.prototype, "historyPeriod", void 0);
__decorate([
    Field(() => SafeIntResolver),
    __metadata("design:type", Number)
], QuotaQueryType.prototype, "memberLimit", void 0);
__decorate([
    Field(() => SafeIntResolver),
    __metadata("design:type", Number)
], QuotaQueryType.prototype, "storageQuota", void 0);
__decorate([
    Field(() => SafeIntResolver, { nullable: true }),
    __metadata("design:type", Number)
], QuotaQueryType.prototype, "copilotActionLimit", void 0);
__decorate([
    Field(() => HumanReadableQuotaType),
    __metadata("design:type", HumanReadableQuotaType)
], QuotaQueryType.prototype, "humanReadable", void 0);
__decorate([
    Field(() => SafeIntResolver),
    __metadata("design:type", Number)
], QuotaQueryType.prototype, "usedSize", void 0);
QuotaQueryType = __decorate([
    ObjectType()
], QuotaQueryType);
export { QuotaQueryType };
/// ======== utils ========
export function formatSize(bytes, decimals = 2) {
    if (bytes === 0)
        return '0 B';
    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(bytes) / Math.log(OneKB));
    return (parseFloat((bytes / Math.pow(OneKB, i)).toFixed(dm)) + ' ' + ByteUnit[i]);
}
export function formatDate(ms) {
    return `${(ms / OneDay).toFixed(0)} days`;
}
//# sourceMappingURL=types.js.map