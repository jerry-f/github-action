import { Features } from '../../core/features';
import { Quotas } from '../../core/quota/schema';
import { migrateNewFeatureTable, upsertFeature } from './utils/user-features';
export class UserFeaturesInit1698652531198 {
    // do the migration
    static async up(db) {
        // upgrade features from lower version to higher version
        for (const feature of Features) {
            await upsertFeature(db, feature);
        }
        await migrateNewFeatureTable(db);
        for (const quota of Quotas) {
            await upsertFeature(db, quota);
        }
    }
    // revert the migration
    static async down(_db) {
        // TODO: revert the migration
    }
}
//# sourceMappingURL=1698652531198-user-features-init.js.map