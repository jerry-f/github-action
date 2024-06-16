import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1714982671938 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1714982671938-update-prompts.js.map