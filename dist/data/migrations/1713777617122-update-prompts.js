import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1713777617122 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1713777617122-update-prompts.js.map