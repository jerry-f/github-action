import assert from 'node:assert';
import { omit } from 'lodash-es';
import Stripe from 'stripe';
import { Config } from '../../fundamentals';
export const StripeProvider = {
    provide: Stripe,
    useFactory: (config) => {
        const stripeConfig = config.plugins.payment.stripe;
        assert(stripeConfig, 'Stripe configuration is missing');
        return new Stripe(stripeConfig.keys.APIKey, omit(stripeConfig, 'keys'));
    },
    inject: [Config],
};
//# sourceMappingURL=stripe.js.map