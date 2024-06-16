import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1717140940966 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1717140940966-update-prompts.js.map