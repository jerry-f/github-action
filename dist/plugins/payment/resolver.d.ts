import type { User, UserSubscription } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { CurrentUser } from '../../core/auth';
import { Config, URLHelper } from '../../fundamentals';
import { SubscriptionService } from './service';
import { SubscriptionPlan, SubscriptionRecurring, SubscriptionStatus } from './types';
declare class SubscriptionPrice {
    type: 'fixed';
    plan: SubscriptionPlan;
    currency: string;
    amount?: number | null;
    yearlyAmount?: number | null;
}
export declare class UserSubscriptionType implements Partial<UserSubscription> {
    stripeSubscriptionId: string;
    plan: SubscriptionPlan;
    recurring: SubscriptionRecurring;
    status: SubscriptionStatus;
    start: Date;
    end: Date;
    trialStart?: Date | null;
    trialEnd?: Date | null;
    nextBillAt?: Date | null;
    canceledAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
declare class CreateCheckoutSessionInput {
    recurring: SubscriptionRecurring;
    plan: SubscriptionPlan;
    coupon: string | null;
    successCallbackLink: string;
    idempotencyKey: string;
}
export declare class SubscriptionResolver {
    private readonly service;
    private readonly url;
    constructor(service: SubscriptionService, url: URLHelper);
    prices(user?: CurrentUser): Promise<SubscriptionPrice[]>;
    createCheckoutSession(user: CurrentUser, input: CreateCheckoutSessionInput): Promise<string>;
    createCustomerPortal(user: CurrentUser): Promise<string>;
    cancelSubscription(user: CurrentUser, plan: SubscriptionPlan, idempotencyKey: string): Promise<{
        id: number;
        userId: string;
        plan: string;
        recurring: string;
        stripeSubscriptionId: string;
        status: string;
        start: Date;
        end: Date;
        nextBillAt: Date | null;
        canceledAt: Date | null;
        trialStart: Date | null;
        trialEnd: Date | null;
        stripeScheduleId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    resumeSubscription(user: CurrentUser, plan: SubscriptionPlan, idempotencyKey: string): Promise<{
        id: number;
        userId: string;
        plan: string;
        recurring: string;
        stripeSubscriptionId: string;
        status: string;
        start: Date;
        end: Date;
        nextBillAt: Date | null;
        canceledAt: Date | null;
        trialStart: Date | null;
        trialEnd: Date | null;
        stripeScheduleId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSubscriptionRecurring(user: CurrentUser, recurring: SubscriptionRecurring, plan: SubscriptionPlan, idempotencyKey: string): Promise<{
        id: number;
        userId: string;
        plan: string;
        recurring: string;
        stripeSubscriptionId: string;
        status: string;
        start: Date;
        end: Date;
        nextBillAt: Date | null;
        canceledAt: Date | null;
        trialStart: Date | null;
        trialEnd: Date | null;
        stripeScheduleId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare class UserSubscriptionResolver {
    private readonly config;
    private readonly db;
    constructor(config: Config, db: PrismaClient);
    subscription(ctx: {
        isAdminQuery: boolean;
    }, me: User, user: User, plan: SubscriptionPlan): Promise<{
        id: number;
        userId: string;
        plan: string;
        recurring: string;
        stripeSubscriptionId: string;
        status: string;
        start: Date;
        end: Date;
        nextBillAt: Date | null;
        canceledAt: Date | null;
        trialStart: Date | null;
        trialEnd: Date | null;
        stripeScheduleId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | {
        stripeSubscriptionId: string;
        plan: SubscriptionPlan;
        recurring: SubscriptionRecurring;
        status: SubscriptionStatus;
        start: Date;
        end: Date;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    subscriptions(me: User, user: User): Promise<UserSubscription[]>;
    invoices(me: User, user: User, take: number, skip?: number): Promise<{
        id: number;
        userId: string;
        stripeInvoiceId: string;
        currency: string;
        amount: number;
        status: string;
        plan: string;
        recurring: string;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        lastPaymentError: string | null;
        link: string | null;
    }[]>;
}
export {};
//# sourceMappingURL=resolver.d.ts.map