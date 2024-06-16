import { refreshPrompts } from './utils/prompts';
export class AddMakeItRealWithTextPrompt1715149980782 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1715149980782-add-make-it-real-with-text-prompt.js.map