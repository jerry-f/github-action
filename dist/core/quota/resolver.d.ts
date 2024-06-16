import { UserType } from '../user';
import { QuotaService } from './service';
export declare class QuotaManagementResolver {
    private readonly quota;
    constructor(quota: QuotaService);
    getQuota(me: UserType): Promise<import("./quota").QuotaConfig>;
}
//# sourceMappingURL=resolver.d.ts.map