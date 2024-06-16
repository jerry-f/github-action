import { refreshPrompts } from './utils/prompts';
export class UpdatePrompt1713864641056 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1713864641056-update-prompt.js.map