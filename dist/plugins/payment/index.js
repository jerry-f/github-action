var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import './config';
import { ServerFeature } from '../../core/config';
import { FeatureModule } from '../../core/features';
import { Plugin } from '../registry';
import { SubscriptionResolver, UserSubscriptionResolver } from './resolver';
import { ScheduleManager } from './schedule';
import { SubscriptionService } from './service';
import { StripeProvider } from './stripe';
import { StripeWebhook } from './webhook';
let PaymentModule = class PaymentModule {
};
PaymentModule = __decorate([
    Plugin({
        name: 'payment',
        imports: [FeatureModule],
        providers: [
            ScheduleManager,
            StripeProvider,
            SubscriptionService,
            SubscriptionResolver,
            UserSubscriptionResolver,
        ],
        controllers: [StripeWebhook],
        requires: [
            'plugins.payment.stripe.keys.APIKey',
            'plugins.payment.stripe.keys.webhookKey',
        ],
        contributesTo: ServerFeature.Payment,
        if: config => config.flavor.graphql,
    })
], PaymentModule);
export { PaymentModule };
//# sourceMappingURL=index.js.map