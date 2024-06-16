import { z } from 'zod';
import { FeatureType } from './common';
export declare const featureEarlyAccess: z.ZodObject<{
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
}>;
export declare const featureAIEarlyAccess: z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.AIEarlyAccess>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.AIEarlyAccess;
    configs: {};
}, {
    feature: FeatureType.AIEarlyAccess;
    configs: {};
}>;
//# sourceMappingURL=early-access.d.ts.map