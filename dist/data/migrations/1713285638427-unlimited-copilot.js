import { FeatureType } from '../../core/features';
import { upsertLatestFeatureVersion } from './utils/user-features';
export class UnlimitedCopilot1713285638427 {
    // do the migration
    static async up(db) {
        await upsertLatestFeatureVersion(db, FeatureType.UnlimitedCopilot);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1713285638427-unlimited-copilot.js.map