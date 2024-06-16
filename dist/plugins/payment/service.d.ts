import type { User, UserSubscription } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { CurrentUser } from '../../core/auth';
import { FeatureManagementService } from '../../core/features';
import { Config, EventEmitter } from '../../fundamentals';
import { ScheduleManager } from './schedule';
import { SubscriptionPlan, SubscriptionPriceVariant, SubscriptionRecurring } from './types';
export declare function encodeLookupKey(plan: SubscriptionPlan, recurring: SubscriptionRecurring, variant?: SubscriptionPriceVariant): string;
export declare function decodeLookupKey(key: string): [SubscriptionPlan, SubscriptionRecurring, SubscriptionPriceVariant?];
export declare enum CouponType {
    ProEarlyAccessOneYearFree = "pro_ea_one_year_free",
    AIEarlyAccessOneYearFree = "ai_ea_one_year_free",
    ProEarlyAccessAIOneYearFree = "ai_pro_ea_one_year_free"
}
export declare class SubscriptionService {
    private readonly config;
    private readonly stripe;
    private readonly db;
    private readonly scheduleManager;
    private readonly event;
    private readonly features;
    private readonly logger;
    constructor(config: Config, stripe: Stripe, db: PrismaClient, scheduleManager: ScheduleManager, event: EventEmitter, features: FeatureManagementService);
    listPrices(user?: CurrentUser): Promise<Stripe.Price[]>;
    createCheckoutSession({ user, recurring, plan, promotionCode, redirectUrl, idempotencyKey, }: {
        user: CurrentUser;
        recurring: SubscriptionRecurring;
        plan: SubscriptionPlan;
        promotionCode?: string | null;
        redirectUrl: string;
        idempotencyKey: string;
    }): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    cancelSubscription(idempotencyKey: string, userId: string, plan: SubscriptionPlan): Promise<UserSubscription>;
    resumeCanceledSubscription(idempotencyKey: string, userId: string, plan: SubscriptionPlan): Promise<UserSubscription>;
    updateSubscriptionRecurring(idempotencyKey: string, userId: string, plan: SubscriptionPlan, recurring: SubscriptionRecurring): Promise<UserSubscription>;
    createCustomerPortal(id: string): Promise<string>;
    onSubscriptionChanges(subscription: Stripe.Subscription): Promise<void>;
    onSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void>;
    onInvoicePaid(stripeInvoice: Stripe.Invoice): Promise<void>;
    saveInvoice(stripeInvoice: Stripe.Invoice): Promise<void>;
    private saveSubscription;
    private getOrCreateCustomer;
    onUserUpdated(user: User): Promise<void>;
    private retrieveUserFromCustomer;
    private getPrice;
    /**
     * Get available for different plans with special early-access price and coupon
     */
    private getAvailablePrice;
    private getAvailablePromotionCode;
    private decodePlanFromSubscription;
}
//# sourceMappingURL=service.d.ts.map