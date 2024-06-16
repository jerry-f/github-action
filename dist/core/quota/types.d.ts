import { z } from 'zod';
import { FeatureKind } from '../features/types';
/**
 * naming rule:
 * we append Vx to the end of the feature name to indicate the version of the feature
 * x is a number, start from 1, this number will be change only at the time we change the schema of config
 * for example, we change the value of `blobLimit` from 10MB to 100MB, then we will only change `version` field from 1 to 2
 * but if we remove the `blobLimit` field or rename it, then we will change the Vx to Vx+1
 */
export declare enum QuotaType {
    FreePlanV1 = "free_plan_v1",
    ProPlanV1 = "pro_plan_v1",
    RestrictedPlanV1 = "restricted_plan_v1"
}
export declare const QuotaSchema: z.ZodIntersection<z.ZodObject<z.objectUtil.extendShape<{
    feature: z.ZodString;
    type: z.ZodNativeEnum<typeof FeatureKind>;
    version: z.ZodNumber;
    configs: z.ZodUnknown;
}, {
    type: z.ZodLiteral<FeatureKind.Quota>;
}>, "strip", z.ZodTypeAny, {
    type: FeatureKind.Quota;
    version: number;
    feature: string;
    configs?: unknown;
}, {
    type: FeatureKind.Quota;
    version: number;
    feature: string;
    configs?: unknown;
}>, z.ZodDiscriminatedUnion<"feature", [z.ZodObject<{
    feature: z.ZodEnum<[QuotaType.FreePlanV1, QuotaType.ProPlanV1, QuotaType.RestrictedPlanV1]>;
    configs: z.ZodObject<{
        name: z.ZodString;
        blobLimit: z.ZodNumber;
        storageQuota: z.ZodNumber;
        historyPeriod: z.ZodNumber;
        memberLimit: z.ZodNumber;
        businessBlobLimit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        copilotActionLimit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        blobLimit: number;
        storageQuota: number;
        historyPeriod: number;
        memberLimit: number;
        businessBlobLimit?: number | null | undefined;
        copilotActionLimit?: number | null | undefined;
    }, {
        name: string;
        blobLimit: number;
        storageQuota: number;
        historyPeriod: number;
        memberLimit: number;
        businessBlobLimit?: number | null | undefined;
        copilotActionLimit?: number | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    feature: QuotaType;
    configs: {
        name: string;
        blobLimit: number;
        storageQuota: number;
        historyPeriod: number;
        memberLimit: number;
        businessBlobLimit?: number | null | undefined;
        copilotActionLimit?: number | null | undefined;
    };
}, {
    feature: QuotaType;
    configs: {
        name: string;
        blobLimit: number;
        storageQuota: number;
        historyPeriod: number;
        memberLimit: number;
        businessBlobLimit?: number | null | undefined;
        copilotActionLimit?: number | null | undefined;
    };
}>]>>;
export type Quota = z.infer<typeof QuotaSchema>;
export declare class HumanReadableQuotaType {
    name: string;
    blobLimit: string;
    storageQuota: string;
    historyPeriod: string;
    memberLimit: string;
    copilotActionLimit?: string;
}
export declare class QuotaQueryType {
    name: string;
    blobLimit: number;
    historyPeriod: number;
    memberLimit: number;
    storageQuota: number;
    copilotActionLimit?: number;
    humanReadable: HumanReadableQuotaType;
    usedSize: number;
}
export declare function formatSize(bytes: number, decimals?: number): string;
export declare function formatDate(ms: number): string;
//# sourceMappingURL=types.d.ts.map