import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1716451792364 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1716451792364-update-prompts.js.map