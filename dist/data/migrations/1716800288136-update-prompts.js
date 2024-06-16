import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1716800288136 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1716800288136-update-prompts.js.map