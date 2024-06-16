import { UserService } from '../user/service';
import { UserType } from '../user/types';
import { EarlyAccessType, FeatureManagementService } from './management';
import { FeatureType } from './types';
export declare class FeatureManagementResolver {
    private readonly users;
    private readonly feature;
    constructor(users: UserService, feature: FeatureManagementService);
    userFeatures(user: UserType): Promise<FeatureType[]>;
    addToEarlyAccess(email: string, type: EarlyAccessType): Promise<number>;
    removeEarlyAccess(email: string): Promise<number>;
    earlyAccessUsers(ctx: {
        isAdminQuery: boolean;
    }): Promise<UserType[]>;
    addAdminister(email: string): Promise<boolean>;
}
//# sourceMappingURL=resolver.d.ts.map