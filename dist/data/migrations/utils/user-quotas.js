import { FeatureKind } from '../../../core/features';
import { getLatestQuota } from '../../../core/quota/schema';
import { upsertFeature } from './user-features';
export async function upgradeQuotaVersion(db, quota, reason) {
    // add new quota
    await upsertFeature(db, quota);
    // migrate all users that using old quota to new quota
    await db.$transaction(async (tx) => {
        const latestQuotaVersion = await tx.features.findFirstOrThrow({
            where: { feature: quota.feature },
            orderBy: { version: 'desc' },
            select: { id: true },
        });
        // find all users that have old free plan
        const userIds = await tx.user.findMany({
            where: {
                features: {
                    some: {
                        feature: {
                            type: FeatureKind.Quota,
                            feature: quota.feature,
                            version: { lt: quota.version },
                        },
                        activated: true,
                    },
                },
            },
            select: { id: true },
        });
        // deactivate all old quota for the user
        await tx.userFeatures.updateMany({
            where: {
                id: undefined,
                userId: {
                    in: userIds.map(({ id }) => id),
                },
                feature: {
                    type: FeatureKind.Quota,
                },
                activated: true,
            },
            data: {
                activated: false,
            },
        });
        await tx.userFeatures.createMany({
            data: userIds.map(({ id: userId }) => ({
                userId,
                featureId: latestQuotaVersion.id,
                reason,
                activated: true,
            })),
        });
    }, {
        maxWait: 10000,
        timeout: 20000,
    });
}
export async function upsertLatestQuotaVersion(db, type) {
    const latestQuota = getLatestQuota(type);
    await upsertFeature(db, latestQuota);
}
export async function upgradeLatestQuotaVersion(db, type, reason) {
    const latestQuota = getLatestQuota(type);
    await upgradeQuotaVersion(db, latestQuota, reason);
}
//# sourceMappingURL=user-quotas.js.map