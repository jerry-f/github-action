import { refreshPrompts } from './utils/prompts';
export class RefreshPrompt1713185798895 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1713185798895-refresh-prompt.js.map