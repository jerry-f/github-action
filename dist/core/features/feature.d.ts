import { PrismaTransaction } from '../../fundamentals';
import { Feature, FeatureType } from './types';
declare class FeatureConfig<T extends FeatureType> {
    readonly config: Feature & {
        feature: T;
    };
    constructor(data: any);
    get name(): T;
}
export type FeatureConfigType<F extends FeatureType> = FeatureConfig<F>;
export declare function getFeature(prisma: PrismaTransaction, featureId: number): Promise<FeatureConfigType<FeatureType>>;
export {};
//# sourceMappingURL=feature.d.ts.map