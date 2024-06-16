var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StripeWebhook_1;
import assert from 'node:assert';
import { Controller, Logger, NotAcceptableException, Post, Req, } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Stripe from 'stripe';
import { Public } from '../../core/auth';
import { Config } from '../../fundamentals';
let StripeWebhook = StripeWebhook_1 = class StripeWebhook {
    constructor(config, stripe, event) {
        this.stripe = stripe;
        this.event = event;
        this.logger = new Logger(StripeWebhook_1.name);
        assert(config.plugins.payment.stripe);
        this.webhookKey = config.plugins.payment.stripe.keys.webhookKey;
    }
    async handleWebhook(req) {
        // Check if webhook signing is configured.
        // Retrieve the event by verifying the signature using the raw body and secret.
        const signature = req.headers['stripe-signature'];
        try {
            const event = this.stripe.webhooks.constructEvent(req.rawBody ?? '', signature ?? '', this.webhookKey);
            this.logger.debug(`[${event.id}] Stripe Webhook {${event.type}} received.`);
            // Stripe requires responseing webhook immediately and handle event asynchronously.
            setImmediate(() => {
                // handle duplicated events?
                // see https://stripe.com/docs/webhooks#handle-duplicate-events
                this.event.emitAsync(event.type, event.data.object).catch(e => {
                    this.logger.error('Failed to handle Stripe Webhook event.', e);
                });
            });
        }
        catch (err) {
            this.logger.error('Stripe Webhook error', err);
            throw new NotAcceptableException();
        }
    }
};
__decorate([
    Public(),
    Post('/webhook'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeWebhook.prototype, "handleWebhook", null);
StripeWebhook = StripeWebhook_1 = __decorate([
    Controller('/api/stripe'),
    __metadata("design:paramtypes", [Config,
        Stripe,
        EventEmitter2])
], StripeWebhook);
export { StripeWebhook };
//# sourceMappingURL=webhook.js.map