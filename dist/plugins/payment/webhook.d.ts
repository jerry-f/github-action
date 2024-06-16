import type { RawBodyRequest } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { Request } from 'express';
import Stripe from 'stripe';
import { Config } from '../../fundamentals';
export declare class StripeWebhook {
    private readonly stripe;
    private readonly event;
    private readonly webhookKey;
    private readonly logger;
    constructor(config: Config, stripe: Stripe, event: EventEmitter2);
    handleWebhook(req: RawBodyRequest<Request>): Promise<void>;
}
//# sourceMappingURL=webhook.d.ts.map