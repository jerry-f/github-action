import { refreshPrompts } from './utils/prompts';
export class Prompts1712068777394 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(_db) { }
}
//# sourceMappingURL=1712068777394-prompts.js.map