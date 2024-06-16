export var SubscriptionRecurring;
(function (SubscriptionRecurring) {
    SubscriptionRecurring["Monthly"] = "monthly";
    SubscriptionRecurring["Yearly"] = "yearly";
})(SubscriptionRecurring || (SubscriptionRecurring = {}));
export var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["Free"] = "free";
    SubscriptionPlan["Pro"] = "pro";
    SubscriptionPlan["AI"] = "ai";
    SubscriptionPlan["Team"] = "team";
    SubscriptionPlan["Enterprise"] = "enterprise";
    SubscriptionPlan["SelfHosted"] = "selfhosted";
})(SubscriptionPlan || (SubscriptionPlan = {}));
export var SubscriptionPriceVariant;
(function (SubscriptionPriceVariant) {
    SubscriptionPriceVariant["EA"] = "earlyaccess";
})(SubscriptionPriceVariant || (SubscriptionPriceVariant = {}));
// see https://stripe.com/docs/api/subscriptions/object#subscription_object-status
export var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["Active"] = "active";
    SubscriptionStatus["PastDue"] = "past_due";
    SubscriptionStatus["Unpaid"] = "unpaid";
    SubscriptionStatus["Canceled"] = "canceled";
    SubscriptionStatus["Incomplete"] = "incomplete";
    SubscriptionStatus["Paused"] = "paused";
    SubscriptionStatus["IncompleteExpired"] = "incomplete_expired";
    SubscriptionStatus["Trialing"] = "trialing";
})(SubscriptionStatus || (SubscriptionStatus = {}));
export var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["Draft"] = "draft";
    InvoiceStatus["Open"] = "open";
    InvoiceStatus["Void"] = "void";
    InvoiceStatus["Paid"] = "paid";
    InvoiceStatus["Uncollectible"] = "uncollectible";
})(InvoiceStatus || (InvoiceStatus = {}));
//# sourceMappingURL=types.js.map