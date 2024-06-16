import { Quotas } from '../../core/quota/schema';
import { upgradeQuotaVersion } from './utils/user-quotas';
export class BusinessBlobLimit1706513866287 {
    // do the migration
    static async up(db) {
        // free plan 1.1
        const quota = Quotas[4];
        await upgradeQuotaVersion(db, quota, 'free plan 1.1 migration');
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1706513866287-business-blob-limit.js.map