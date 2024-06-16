import { QuotaType } from '../../core/quota/types';
import { upgradeLatestQuotaVersion } from './utils/user-quotas';
export class RefreshFreePlan1712224382221 {
    // do the migration
    static async up(db) {
        // free plan 1.1
        await upgradeLatestQuotaVersion(db, QuotaType.FreePlanV1, 'free plan 1.1 migration');
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1712224382221-refresh-free-plan.js.map