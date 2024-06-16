import Stripe from 'stripe';
export declare class ScheduleManager {
    private readonly stripe;
    private _schedule;
    private readonly logger;
    constructor(stripe: Stripe);
    static create(stripe: Stripe, schedule?: Stripe.SubscriptionSchedule): ScheduleManager;
    get schedule(): Stripe.SubscriptionSchedule | null;
    get currentPhase(): Stripe.SubscriptionSchedule.Phase | null | undefined;
    get nextPhase(): Stripe.SubscriptionSchedule.Phase | null | undefined;
    get isActive(): boolean;
    fromSchedule(schedule: string | Stripe.SubscriptionSchedule): Promise<ScheduleManager>;
    fromSubscription(idempotencyKey: string, subscription: string | Stripe.Subscription): Promise<ScheduleManager>;
    /**
     * Cancel a subscription by marking schedule's end behavior to `cancel`.
     * At the same time, the coming phase's price and coupon will be saved to metadata for later resuming to correction subscription.
     */
    cancel(idempotencyKey: string): Promise<void>;
    resume(idempotencyKey: string): Promise<void>;
    release(idempotencyKey: string): Promise<void>;
    update(idempotencyKey: string, price: string): Promise<void>;
}
//# sourceMappingURL=schedule.d.ts.map