import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1717490700326 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1717490700326-update-prompts.js.map