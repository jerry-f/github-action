import { refreshPrompts } from './utils/prompts';
export class UpdatePrompts1715672224087 {
    // do the migration
    static async up(db) {
        await refreshPrompts(db);
    }
    // revert the migration
    static async down(db) {
        await db.aiPrompt.updateMany({
            where: {
                model: 'gpt-4o',
            },
            data: {
                model: 'gpt-4-vision-preview',
            },
        });
    }
}
//# sourceMappingURL=1715672224087-update-prompts.js.map