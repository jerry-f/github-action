import { FeatureSchema } from './types';
class FeatureConfig {
    constructor(data) {
        const config = FeatureSchema.safeParse(data);
        if (config.success) {
            // @ts-expect-error allow
            this.config = config.data;
        }
        else {
            throw new Error(`Invalid quota config: ${config.error.message}`);
        }
    }
    /// feature name of quota
    get name() {
        return this.config.feature;
    }
}
const FeatureCache = new Map();
export async function getFeature(prisma, featureId) {
    const cachedFeature = FeatureCache.get(featureId);
    if (cachedFeature) {
        return cachedFeature;
    }
    const feature = await prisma.features.findFirst({
        where: {
            id: featureId,
        },
    });
    if (!feature) {
        // this should unreachable
        throw new Error(`Quota config ${featureId} not found`);
    }
    const config = new FeatureConfig(feature);
    // we always edit quota config as a new quota config
    // so we can cache it by featureId
    FeatureCache.set(featureId, config);
    return config;
}
//# sourceMappingURL=feature.js.map