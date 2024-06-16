import { z } from 'zod';
import { FeatureType } from './common';
export declare const featureUnlimitedCopilot: z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.UnlimitedCopilot>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.UnlimitedCopilot;
    configs: {};
}, {
    feature: FeatureType.UnlimitedCopilot;
    configs: {};
}>;
//# sourceMappingURL=unlimited-copilot.d.ts.map