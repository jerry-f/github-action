import { z } from 'zod';
import { FeatureType } from './common';
export declare const featureUnlimitedWorkspace: z.ZodObject<{
    feature: z.ZodLiteral<FeatureType.UnlimitedWorkspace>;
    configs: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    feature: FeatureType.UnlimitedWorkspace;
    configs: {};
}, {
    feature: FeatureType.UnlimitedWorkspace;
    configs: {};
}>;
//# sourceMappingURL=unlimited-workspace.d.ts.map