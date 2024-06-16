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
import { BadGatewayException, ForbiddenException } from '@nestjs/common';
import { Args, Context, Field, InputType, Int, Mutation, ObjectType, Parent, Query, registerEnumType, ResolveField, Resolver, } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { groupBy } from 'lodash-es';
import { CurrentUser, Public } from '../../core/auth';
import { UserType } from '../../core/user';
import { Config, URLHelper } from '../../fundamentals';
import { decodeLookupKey, SubscriptionService } from './service';
import { InvoiceStatus, SubscriptionPlan, SubscriptionRecurring, SubscriptionStatus, } from './types';
registerEnumType(SubscriptionStatus, { name: 'SubscriptionStatus' });
registerEnumType(SubscriptionRecurring, { name: 'SubscriptionRecurring' });
registerEnumType(SubscriptionPlan, { name: 'SubscriptionPlan' });
registerEnumType(InvoiceStatus, { name: 'InvoiceStatus' });
let SubscriptionPrice = class SubscriptionPrice {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], SubscriptionPrice.prototype, "type", void 0);
__decorate([
    Field(() => SubscriptionPlan),
    __metadata("design:type", String)
], SubscriptionPrice.prototype, "plan", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], SubscriptionPrice.prototype, "currency", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Object)
], SubscriptionPrice.prototype, "amount", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Object)
], SubscriptionPrice.prototype, "yearlyAmount", void 0);
SubscriptionPrice = __decorate([
    ObjectType()
], SubscriptionPrice);
let UserSubscriptionType = class UserSubscriptionType {
};
__decorate([
    Field({ name: 'id' }),
    __metadata("design:type", String)
], UserSubscriptionType.prototype, "stripeSubscriptionId", void 0);
__decorate([
    Field(() => SubscriptionPlan, {
        description: "The 'Free' plan just exists to be a placeholder and for the type convenience of frontend.\nThere won't actually be a subscription with plan 'Free'",
    }),
    __metadata("design:type", String)
], UserSubscriptionType.prototype, "plan", void 0);
__decorate([
    Field(() => SubscriptionRecurring),
    __metadata("design:type", String)
], UserSubscriptionType.prototype, "recurring", void 0);
__decorate([
    Field(() => SubscriptionStatus),
    __metadata("design:type", String)
], UserSubscriptionType.prototype, "status", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], UserSubscriptionType.prototype, "start", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], UserSubscriptionType.prototype, "end", void 0);
__decorate([
    Field(() => Date, { nullable: true }),
    __metadata("design:type", Object)
], UserSubscriptionType.prototype, "trialStart", void 0);
__decorate([
    Field(() => Date, { nullable: true }),
    __metadata("design:type", Object)
], UserSubscriptionType.prototype, "trialEnd", void 0);
__decorate([
    Field(() => Date, { nullable: true }),
    __metadata("design:type", Object)
], UserSubscriptionType.prototype, "nextBillAt", void 0);
__decorate([
    Field(() => Date, { nullable: true }),
    __metadata("design:type", Object)
], UserSubscriptionType.prototype, "canceledAt", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], UserSubscriptionType.prototype, "createdAt", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], UserSubscriptionType.prototype, "updatedAt", void 0);
UserSubscriptionType = __decorate([
    ObjectType('UserSubscription')
], UserSubscriptionType);
export { UserSubscriptionType };
let UserInvoiceType = class UserInvoiceType {
};
__decorate([
    Field({ name: 'id' }),
    __metadata("design:type", String)
], UserInvoiceType.prototype, "stripeInvoiceId", void 0);
__decorate([
    Field(() => SubscriptionPlan),
    __metadata("design:type", String)
], UserInvoiceType.prototype, "plan", void 0);
__decorate([
    Field(() => SubscriptionRecurring),
    __metadata("design:type", String)
], UserInvoiceType.prototype, "recurring", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], UserInvoiceType.prototype, "currency", void 0);
__decorate([
    Field(),
    __metadata("design:type", Number)
], UserInvoiceType.prototype, "amount", void 0);
__decorate([
    Field(() => InvoiceStatus),
    __metadata("design:type", String)
], UserInvoiceType.prototype, "status", void 0);
__decorate([
    Field(),
    __metadata("design:type", String)
], UserInvoiceType.prototype, "reason", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], UserInvoiceType.prototype, "lastPaymentError", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], UserInvoiceType.prototype, "link", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], UserInvoiceType.prototype, "createdAt", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], UserInvoiceType.prototype, "updatedAt", void 0);
UserInvoiceType = __decorate([
    ObjectType('UserInvoice')
], UserInvoiceType);
let CreateCheckoutSessionInput = class CreateCheckoutSessionInput {
};
__decorate([
    Field(() => SubscriptionRecurring, {
        nullable: true,
        defaultValue: SubscriptionRecurring.Yearly,
    }),
    __metadata("design:type", String)
], CreateCheckoutSessionInput.prototype, "recurring", void 0);
__decorate([
    Field(() => SubscriptionPlan, {
        nullable: true,
        defaultValue: SubscriptionPlan.Pro,
    }),
    __metadata("design:type", String)
], CreateCheckoutSessionInput.prototype, "plan", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], CreateCheckoutSessionInput.prototype, "coupon", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CreateCheckoutSessionInput.prototype, "successCallbackLink", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CreateCheckoutSessionInput.prototype, "idempotencyKey", void 0);
CreateCheckoutSessionInput = __decorate([
    InputType()
], CreateCheckoutSessionInput);
let SubscriptionResolver = class SubscriptionResolver {
    constructor(service, url) {
        this.service = service;
        this.url = url;
    }
    async prices(user) {
        const prices = await this.service.listPrices(user);
        const group = groupBy(prices, price => {
            // @ts-expect-error empty lookup key is filtered out
            const [plan] = decodeLookupKey(price.lookup_key);
            return plan;
        });
        function findPrice(plan) {
            const prices = group[plan];
            if (!prices) {
                return null;
            }
            const monthlyPrice = prices.find(p => p.recurring?.interval === 'month');
            const yearlyPrice = prices.find(p => p.recurring?.interval === 'year');
            const currency = monthlyPrice?.currency ?? yearlyPrice?.currency ?? 'usd';
            return {
                currency,
                amount: monthlyPrice?.unit_amount,
                yearlyAmount: yearlyPrice?.unit_amount,
            };
        }
        // extend it when new plans are added
        const fixedPlans = [SubscriptionPlan.Pro, SubscriptionPlan.AI];
        return fixedPlans.reduce((prices, plan) => {
            const price = findPrice(plan);
            if (price && (price.amount || price.yearlyAmount)) {
                prices.push({
                    type: 'fixed',
                    plan,
                    ...price,
                });
            }
            return prices;
        }, []);
    }
    async createCheckoutSession(user, input) {
        const session = await this.service.createCheckoutSession({
            user,
            plan: input.plan,
            recurring: input.recurring,
            promotionCode: input.coupon,
            redirectUrl: this.url.link(input.successCallbackLink),
            idempotencyKey: input.idempotencyKey,
        });
        if (!session.url) {
            throw new BadGatewayException('Failed to create checkout session.');
        }
        return session.url;
    }
    async createCustomerPortal(user) {
        return this.service.createCustomerPortal(user.id);
    }
    async cancelSubscription(user, plan, idempotencyKey) {
        return this.service.cancelSubscription(idempotencyKey, user.id, plan);
    }
    async resumeSubscription(user, plan, idempotencyKey) {
        return this.service.resumeCanceledSubscription(idempotencyKey, user.id, plan);
    }
    async updateSubscriptionRecurring(user, recurring, plan, idempotencyKey) {
        return this.service.updateSubscriptionRecurring(idempotencyKey, user.id, plan, recurring);
    }
};
__decorate([
    Public(),
    Query(() => [SubscriptionPrice]),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "prices", null);
__decorate([
    Mutation(() => String, {
        description: 'Create a subscription checkout link of stripe',
    }),
    __param(0, CurrentUser()),
    __param(1, Args({ name: 'input', type: () => CreateCheckoutSessionInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateCheckoutSessionInput]),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "createCheckoutSession", null);
__decorate([
    Mutation(() => String, {
        description: 'Create a stripe customer portal to manage payment methods',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "createCustomerPortal", null);
__decorate([
    Mutation(() => UserSubscriptionType),
    __param(0, CurrentUser()),
    __param(1, Args({
        name: 'plan',
        type: () => SubscriptionPlan,
        nullable: true,
        defaultValue: SubscriptionPlan.Pro,
    })),
    __param(2, Args('idempotencyKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "cancelSubscription", null);
__decorate([
    Mutation(() => UserSubscriptionType),
    __param(0, CurrentUser()),
    __param(1, Args({
        name: 'plan',
        type: () => SubscriptionPlan,
        nullable: true,
        defaultValue: SubscriptionPlan.Pro,
    })),
    __param(2, Args('idempotencyKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "resumeSubscription", null);
__decorate([
    Mutation(() => UserSubscriptionType),
    __param(0, CurrentUser()),
    __param(1, Args({ name: 'recurring', type: () => SubscriptionRecurring })),
    __param(2, Args({
        name: 'plan',
        type: () => SubscriptionPlan,
        nullable: true,
        defaultValue: SubscriptionPlan.Pro,
    })),
    __param(3, Args('idempotencyKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "updateSubscriptionRecurring", null);
SubscriptionResolver = __decorate([
    Resolver(() => UserSubscriptionType),
    __metadata("design:paramtypes", [SubscriptionService,
        URLHelper])
], SubscriptionResolver);
export { SubscriptionResolver };
let UserSubscriptionResolver = class UserSubscriptionResolver {
    constructor(config, db) {
        this.config = config;
        this.db = db;
    }
    async subscription(ctx, me, user, plan) {
        // allow admin to query other user's subscription
        if (!ctx.isAdminQuery && me.id !== user.id) {
            throw new ForbiddenException('You are not allowed to access this subscription.');
        }
        // @FIXME(@forehalo): should not mock any api for selfhosted server
        // the frontend should avoid calling such api if feature is not enabled
        if (this.config.isSelfhosted) {
            const start = new Date();
            const end = new Date();
            end.setFullYear(start.getFullYear() + 1);
            return {
                stripeSubscriptionId: 'dummy',
                plan: SubscriptionPlan.SelfHosted,
                recurring: SubscriptionRecurring.Yearly,
                status: SubscriptionStatus.Active,
                start,
                end,
                createdAt: start,
                updatedAt: start,
            };
        }
        return this.db.userSubscription.findUnique({
            where: {
                userId_plan: {
                    userId: user.id,
                    plan,
                },
                status: SubscriptionStatus.Active,
            },
        });
    }
    async subscriptions(me, user) {
        if (me.id !== user.id) {
            throw new ForbiddenException('You are not allowed to access this subscription.');
        }
        return this.db.userSubscription.findMany({
            where: {
                userId: user.id,
                status: SubscriptionStatus.Active,
            },
        });
    }
    async invoices(me, user, take, skip) {
        if (me.id !== user.id) {
            throw new ForbiddenException('You are not allowed to access this invoices');
        }
        return this.db.userInvoice.findMany({
            where: {
                userId: user.id,
            },
            take,
            skip,
            orderBy: {
                id: 'desc',
            },
        });
    }
};
__decorate([
    ResolveField(() => UserSubscriptionType, {
        nullable: true,
        deprecationReason: 'use `UserType.subscriptions`',
    }),
    __param(0, Context()),
    __param(1, CurrentUser()),
    __param(2, Parent()),
    __param(3, Args({
        name: 'plan',
        type: () => SubscriptionPlan,
        nullable: true,
        defaultValue: SubscriptionPlan.Pro,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserSubscriptionResolver.prototype, "subscription", null);
__decorate([
    ResolveField(() => [UserSubscriptionType]),
    __param(0, CurrentUser()),
    __param(1, Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserSubscriptionResolver.prototype, "subscriptions", null);
__decorate([
    ResolveField(() => [UserInvoiceType]),
    __param(0, CurrentUser()),
    __param(1, Parent()),
    __param(2, Args('take', { type: () => Int, nullable: true, defaultValue: 8 })),
    __param(3, Args('skip', { type: () => Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], UserSubscriptionResolver.prototype, "invoices", null);
UserSubscriptionResolver = __decorate([
    Resolver(() => UserType),
    __metadata("design:paramtypes", [Config,
        PrismaClient])
], UserSubscriptionResolver);
export { UserSubscriptionResolver };
//# sourceMappingURL=resolver.js.map