import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1715936358947 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1715936358947-update-prompts.js.map