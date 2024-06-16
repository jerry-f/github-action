import type { User } from '@prisma/client';
import type { Payload } from '../../fundamentals/event/def';
export declare enum SubscriptionRecurring {
    Monthly = "monthly",
    Yearly = "yearly"
}
export declare enum SubscriptionPlan {
    Free = "free",
    Pro = "pro",
    AI = "ai",
    Team = "team",
    Enterprise = "enterprise",
    SelfHosted = "selfhosted"
}
export declare enum SubscriptionPriceVariant {
    EA = "earlyaccess"
}
export declare enum SubscriptionStatus {
    Active = "active",
    PastDue = "past_due",
    Unpaid = "unpaid",
    Canceled = "canceled",
    Incomplete = "incomplete",
    Paused = "paused",
    IncompleteExpired = "incomplete_expired",
    Trialing = "trialing"
}
export declare enum InvoiceStatus {
    Draft = "draft",
    Open = "open",
    Void = "void",
    Paid = "paid",
    Uncollectible = "uncollectible"
}
declare module '../../fundamentals/event/def' {
    interface UserEvents {
        subscription: {
            activated: Payload<{
                userId: User['id'];
                plan: SubscriptionPlan;
            }>;
            canceled: Payload<{
                userId: User['id'];
                plan: SubscriptionPlan;
            }>;
        };
    }
}
//# sourceMappingURL=types.d.ts.map