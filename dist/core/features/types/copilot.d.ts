import { z } from 'zod';
import { FeatureType } from './common';
export declare const featureCopilot: z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.Copilot>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.Copilot;
    configs: {};
}, {
    feature: FeatureType.Copilot;
    configs: {};
}>;
//# sourceMappingURL=copilot.d.ts.map