import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1714386922280 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1714386922280-update-prompts.js.map