import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1714021969665 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1714021969665-update-prompts.js.map