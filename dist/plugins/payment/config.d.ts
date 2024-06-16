import type { Stripe } from 'stripe';
import { ModuleConfig } from '../../fundamentals/config';
export interface PaymentStartupConfig {
    stripe?: {
        keys: {
            APIKey: string;
            webhookKey: string;
        };
    } & Stripe.StripeConfig;
}
declare module '../config' {
    interface PluginsConfig {
        payment: ModuleConfig<PaymentStartupConfig>;
    }
}
//# sourceMappingURL=config.d.ts.map