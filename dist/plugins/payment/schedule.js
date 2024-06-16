var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ScheduleManager_1;
import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
let ScheduleManager = ScheduleManager_1 = class ScheduleManager {
    constructor(stripe) {
        this.stripe = stripe;
        this._schedule = null;
        this.logger = new Logger(ScheduleManager_1.name);
    }
    static create(stripe, schedule) {
        const manager = new ScheduleManager_1(stripe);
        if (schedule) {
            manager._schedule = schedule;
        }
        return manager;
    }
    get schedule() {
        return this._schedule;
    }
    get currentPhase() {
        if (!this._schedule) {
            return null;
        }
        return this._schedule.phases.find(phase => phase.start_date * 1000 < Date.now() &&
            phase.end_date * 1000 > Date.now());
    }
    get nextPhase() {
        if (!this._schedule) {
            return null;
        }
        return this._schedule.phases.find(phase => phase.start_date * 1000 > Date.now());
    }
    get isActive() {
        return this._schedule?.status === 'active';
    }
    async fromSchedule(schedule) {
        if (typeof schedule === 'string') {
            const s = await this.stripe.subscriptionSchedules
                .retrieve(schedule)
                .catch(e => {
                this.logger.error('Failed to retrieve subscription schedule', e);
                return undefined;
            });
            return ScheduleManager_1.create(this.stripe, s);
        }
        else {
            return ScheduleManager_1.create(this.stripe, schedule);
        }
    }
    async fromSubscription(idempotencyKey, subscription) {
        if (typeof subscription === 'string') {
            subscription = await this.stripe.subscriptions.retrieve(subscription, {
                expand: ['schedule'],
            });
        }
        if (subscription.schedule) {
            return await this.fromSchedule(subscription.schedule);
        }
        else {
            const schedule = await this.stripe.subscriptionSchedules.create({ from_subscription: subscription.id }, { idempotencyKey });
            return await this.fromSchedule(schedule);
        }
    }
    /**
     * Cancel a subscription by marking schedule's end behavior to `cancel`.
     * At the same time, the coming phase's price and coupon will be saved to metadata for later resuming to correction subscription.
     */
    async cancel(idempotencyKey) {
        if (!this._schedule) {
            throw new Error('No schedule');
        }
        if (!this.isActive || !this.currentPhase) {
            throw new Error('Unexpected subscription schedule status');
        }
        const phases = {
            items: [
                {
                    price: this.currentPhase.items[0].price,
                    quantity: 1,
                },
            ],
            coupon: this.currentPhase.coupon ?? undefined,
            start_date: this.currentPhase.start_date,
            end_date: this.currentPhase.end_date,
        };
        if (this.nextPhase) {
            // cancel a subscription with a schedule exiting will delete the upcoming phase,
            // it's hard to recover the subscription to the original state if user wan't to resume before due.
            // so we manually save the next phase's key information to metadata for later easy resuming.
            phases.metadata = {
                next_coupon: this.nextPhase.coupon || null, // avoid empty string
                next_price: this.nextPhase.items[0].price,
            };
        }
        await this.stripe.subscriptionSchedules.update(this._schedule.id, {
            phases: [phases],
            end_behavior: 'cancel',
        }, { idempotencyKey });
    }
    async resume(idempotencyKey) {
        if (!this._schedule) {
            throw new Error('No schedule');
        }
        if (!this.isActive || !this.currentPhase) {
            throw new Error('Unexpected subscription schedule status');
        }
        const phases = [
            {
                items: [
                    {
                        price: this.currentPhase.items[0].price,
                        quantity: 1,
                    },
                ],
                coupon: this.currentPhase.coupon ?? undefined,
                start_date: this.currentPhase.start_date,
                end_date: this.currentPhase.end_date,
                metadata: {
                    next_coupon: null,
                    next_price: null,
                },
            },
        ];
        if (this.currentPhase.metadata && this.currentPhase.metadata.next_price) {
            phases.push({
                items: [
                    {
                        price: this.currentPhase.metadata.next_price,
                        quantity: 1,
                    },
                ],
                coupon: this.currentPhase.metadata.next_coupon || undefined,
            });
        }
        await this.stripe.subscriptionSchedules.update(this._schedule.id, {
            phases: phases,
            end_behavior: 'release',
        }, { idempotencyKey });
    }
    async release(idempotencyKey) {
        if (!this._schedule) {
            throw new Error('No schedule');
        }
        await this.stripe.subscriptionSchedules.release(this._schedule.id, {
            idempotencyKey,
        });
    }
    async update(idempotencyKey, price) {
        if (!this._schedule) {
            throw new Error('No schedule');
        }
        if (!this.isActive || !this.currentPhase) {
            throw new Error('Unexpected subscription schedule status');
        }
        // if current phase's plan matches target, just release the schedule
        if (this.currentPhase.items[0].price === price) {
            await this.stripe.subscriptionSchedules.release(this._schedule.id, {
                idempotencyKey,
            });
            this._schedule = null;
        }
        else {
            await this.stripe.subscriptionSchedules.update(this._schedule.id, {
                phases: [
                    {
                        items: [
                            {
                                price: this.currentPhase.items[0].price,
                            },
                        ],
                        start_date: this.currentPhase.start_date,
                        end_date: this.currentPhase.end_date,
                    },
                    {
                        items: [
                            {
                                price: price,
                            },
                        ],
                    },
                ],
            }, { idempotencyKey });
        }
    }
};
ScheduleManager = ScheduleManager_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Stripe])
], ScheduleManager);
export { ScheduleManager };
//# sourceMappingURL=schedule.js.map