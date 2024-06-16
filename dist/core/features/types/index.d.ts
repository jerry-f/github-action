import { z } from 'zod';
import { FeatureType } from './common';
export declare enum FeatureKind {
    Feature = 0,
    Quota = 1
}
export declare const commonFeatureSchema: z.ZodObject<{
    feature: z.ZodString;
    type: z.ZodNativeEnum<typeof FeatureKind>;
    version: z.ZodNumber;
    configs: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    type: FeatureKind;
    version: number;
    feature: string;
    configs?: unknown;
}, {
    type: FeatureKind;
    version: number;
    feature: string;
    configs?: unknown;
}>;
export type CommonFeature = z.infer<typeof commonFeatureSchema>;
export declare const Features: Feature[];
export declare const FeatureSchema: z.ZodIntersection<z.ZodObject<z.objectUtil.extendShape<{
    feature: z.ZodString;
    type: z.ZodNativeEnum<typeof FeatureKind>;
    version: z.ZodNumber;
    configs: z.ZodUnknown;
}, {
    type: z.ZodLiteral<FeatureKind.Feature>;
}>, "strip", z.ZodTypeAny, {
    type: FeatureKind.Feature;
    version: number;
    feature: string;
    configs?: unknown;
}, {
    type: FeatureKind.Feature;
    version: number;
    feature: string;
    configs?: unknown;
}>, z.ZodDiscriminatedUnion<"feature", [z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.Copilot>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.Copilot;
    configs: {};
}, {
    feature: FeatureType.Copilot;
    configs: {};
}>, z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.EarlyAccess>;
    configs: z.ZodObject<{
        whitelist: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        whitelist: string[];
    }, {
        whitelist: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.EarlyAccess;
    configs: {
        whitelist: string[];
    };
}, {
    feature: FeatureType.EarlyAccess;
    configs: {
        whitelist: string[];
    };
}>, z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.AIEarlyAccess>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.AIEarlyAccess;
    configs: {};
}, {
    feature: FeatureType.AIEarlyAccess;
    configs: {};
}>, z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.UnlimitedWorkspace>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.UnlimitedWorkspace;
    configs: {};
}, {
    feature: FeatureType.UnlimitedWorkspace;
    configs: {};
}>, z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.UnlimitedCopilot>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.UnlimitedCopilot;
    configs: {};
}, {
    feature: FeatureType.UnlimitedCopilot;
    configs: {};
}>, z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.Admin>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.Admin;
    configs: {};
}, {
    feature: FeatureType.Admin;
    configs: {};
}>]>>;
export type Feature = z.infer<typeof FeatureSchema>;
export { FeatureType };
//# sourceMappingURL=index.d.ts.map