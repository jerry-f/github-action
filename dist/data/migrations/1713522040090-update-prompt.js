import { refreshPrompts } from './utils/prompts';
export class UpdatePrompt1713522040090 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1713522040090-update-prompt.js.map