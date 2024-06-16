import { z } from 'zod';
import { FeatureType } from './common';
export const featureCopilot = z.object({
    feature: z.literal(FeatureType.Copilot),
    configs: z.object({}),
});
//# sourceMappingURL=copilot.js.map