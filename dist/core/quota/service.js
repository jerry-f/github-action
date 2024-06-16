var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OnEvent } from '../../fundamentals';
import { SubscriptionPlan } from '../../plugins/payment/types';
import { FeatureManagementService } from '../features/management';
import { FeatureKind } from '../features/types';
import { QuotaConfig } from './quota';
import { QuotaType } from './types';
let QuotaService = class QuotaService {
    constructor(prisma, feature) {
        this.prisma = prisma;
        this.feature = feature;
    }
    // get activated user quota
    async getUserQuota(userId) {
        const quota = await this.prisma.userFeatures.findFirst({
            where: {
                userId,
                feature: {
                    type: FeatureKind.Quota,
                },
                activated: true,
            },
            select: {
                reason: true,
                createdAt: true,
                expiredAt: true,
                featureId: true,
            },
        });
        if (!quota) {
            // this should unreachable
            throw new Error(`User ${userId} has no quota`);
        }
        const feature = await QuotaConfig.get(this.prisma, quota.featureId);
        return { ...quota, feature };
    }
    // get user all quota records
    async getUserQuotas(userId) {
        const quotas = await this.prisma.userFeatures.findMany({
            where: {
                userId,
                feature: {
                    type: FeatureKind.Quota,
                },
            },
            select: {
                activated: true,
                reason: true,
                createdAt: true,
                expiredAt: true,
                featureId: true,
            },
        });
        const configs = await Promise.all(quotas.map(async (quota) => {
            try {
                return {
                    ...quota,
                    feature: await QuotaConfig.get(this.prisma, quota.featureId),
                };
            }
            catch (_) { }
            return null;
        }));
        return configs.filter(quota => !!quota);
    }
    // switch user to a new quota
    // currently each user can only have one quota
    async switchUserQuota(userId, quota, reason, expiredAt) {
        await this.prisma.$transaction(async (tx) => {
            const hasSameActivatedQuota = await this.hasQuota(userId, quota, tx);
            if (hasSameActivatedQuota) {
                // don't need to switch
                return;
            }
            const featureId = await tx.features
                .findFirst({
                where: { feature: quota, type: FeatureKind.Quota },
                select: { id: true },
                orderBy: { version: 'desc' },
            })
                .then(f => f?.id);
            if (!featureId) {
                throw new Error(`Quota ${quota} not found`);
            }
            // we will deactivate all exists quota for this user
            await tx.userFeatures.updateMany({
                where: {
                    id: undefined,
                    userId,
                    feature: {
                        type: FeatureKind.Quota,
                    },
                },
                data: {
                    activated: false,
                },
            });
            await tx.userFeatures.create({
                data: {
                    userId,
                    featureId,
                    reason: reason ?? 'switch quota',
                    activated: true,
                    expiredAt,
                },
            });
        });
    }
    async hasQuota(userId, quota, tx) {
        const executor = tx ?? this.prisma;
        return executor.userFeatures
            .count({
            where: {
                userId,
                feature: {
                    feature: quota,
                    type: FeatureKind.Quota,
                },
                activated: true,
            },
        })
            .then(count => count > 0);
    }
    async onSubscriptionUpdated({ userId, plan, }) {
        switch (plan) {
            case SubscriptionPlan.AI:
                await this.feature.addCopilot(userId, 'subscription activated');
                break;
            case SubscriptionPlan.Pro:
                await this.switchUserQuota(userId, QuotaType.ProPlanV1, 'subscription activated');
                break;
            default:
                break;
        }
    }
    async onSubscriptionCanceled({ userId, plan, }) {
        switch (plan) {
            case SubscriptionPlan.AI:
                await this.feature.removeCopilot(userId);
                break;
            case SubscriptionPlan.Pro:
                await this.switchUserQuota(userId, QuotaType.FreePlanV1, 'subscription canceled');
                break;
            default:
                break;
        }
    }
};
__decorate([
    OnEvent('user.subscription.activated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotaService.prototype, "onSubscriptionUpdated", null);
__decorate([
    OnEvent('user.subscription.canceled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotaService.prototype, "onSubscriptionCanceled", null);
QuotaService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaClient,
        FeatureManagementService])
], QuotaService);
export { QuotaService };
//# sourceMappingURL=service.js.map