import { FeatureType } from '../../core/features';
import { upsertLatestFeatureVersion } from './utils/user-features';
export class AiEarlyAccess1713176777814 {
    // do the migration
    static async up(db) {
        await upsertLatestFeatureVersion(db, FeatureType.AIEarlyAccess);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1713176777814-ai-early-access.js.map