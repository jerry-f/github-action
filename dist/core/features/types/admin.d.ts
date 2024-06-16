import { z } from 'zod';
import { FeatureType } from './common';
export declare const featureAdministrator: z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.Admin>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.Admin;
    configs: {};
}, {
    feature: FeatureType.Admin;
    configs: {};
}>;
//# sourceMappingURL=admin.d.ts.map