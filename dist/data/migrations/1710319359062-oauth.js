import { loop } from './utils/loop';
export class Oauth1710319359062 {
    // do the migration
    static async up(db) {
        await loop(async (skip, take) => {
            const oldRecords = await db.deprecatedNextAuthAccount.findMany({
                skip,
                take,
                orderBy: {
                    providerAccountId: 'asc',
                },
            });
            await db.connectedAccount.createMany({
                data: oldRecords.map(record => ({
                    userId: record.userId,
                    provider: record.provider,
                    scope: record.scope,
                    providerAccountId: record.providerAccountId,
                    accessToken: record.access_token,
                    refreshToken: record.refresh_token,
                    expiresAt: record.expires_at
                        ? new Date(record.expires_at * 1000)
                        : null,
                })),
            });
            return oldRecords.length;
        }, 10);
    }
    // revert the migration
    static async down(db) {
        await db.connectedAccount.deleteMany({});
    }
}
//# sourceMappingURL=1710319359062-oauth.js.map