import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1714992100105 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1714992100105-update-prompts.js.map