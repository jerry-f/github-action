var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserService_1;
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Config, EventEmitter, OnEvent, } from '../../fundamentals';
import { Quota_FreePlanV1_1 } from '../quota/schema';
let UserService = UserService_1 = class UserService {
    constructor(config, prisma, emitter) {
        this.config = config;
        this.prisma = prisma;
        this.emitter = emitter;
        this.logger = new Logger(UserService_1.name);
        this.defaultUserSelect = {
            id: true,
            name: true,
            email: true,
            emailVerifiedAt: true,
            avatarUrl: true,
            registered: true,
            createdAt: true,
        };
    }
    get userCreatingData() {
        return {
            name: 'Unnamed',
            features: {
                create: {
                    reason: 'created by invite sign up',
                    activated: true,
                    feature: {
                        connect: {
                            feature_version: Quota_FreePlanV1_1,
                        },
                    },
                },
            },
        };
    }
    async createUser(data) {
        return this.prisma.user.create({
            select: this.defaultUserSelect,
            data: {
                ...this.userCreatingData,
                ...data,
            },
        });
    }
    async createAnonymousUser(email, data) {
        const user = await this.findUserByEmail(email);
        if (user) {
            throw new BadRequestException('Email already exists');
        }
        return this.createUser({
            email,
            name: email.split('@')[0],
            ...data,
        });
    }
    async findUserById(id) {
        return this.prisma.user
            .findUnique({
            where: { id },
            select: this.defaultUserSelect,
        })
            .catch(() => {
            return null;
        });
    }
    async findUserByEmail(email) {
        return this.prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
            },
            select: this.defaultUserSelect,
        });
    }
    /**
     * supposed to be used only for `Credential SignIn`
     */
    async findUserWithHashedPasswordByEmail(email) {
        return this.prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
            },
        });
    }
    async findOrCreateUser(email, data) {
        const user = await this.findUserByEmail(email);
        if (user) {
            return user;
        }
        return this.createAnonymousUser(email, data);
    }
    async fulfillUser(email, data) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            return this.createUser({
                ...this.userCreatingData,
                email,
                name: email.split('@')[0],
                ...data,
            });
        }
        else {
            if (user.registered) {
                delete data.registered;
            }
            if (user.emailVerifiedAt) {
                delete data.emailVerifiedAt;
            }
            if (Object.keys(data).length) {
                return await this.prisma.user.update({
                    select: this.defaultUserSelect,
                    where: { id: user.id },
                    data,
                });
            }
        }
        this.emitter.emit('user.updated', user);
        return user;
    }
    async updateUser(id, data, select = this.defaultUserSelect) {
        const user = await this.prisma.user.update({ where: { id }, data, select });
        this.emitter.emit('user.updated', user);
        return user;
    }
    async deleteUser(id) {
        const user = await this.prisma.user.delete({ where: { id } });
        this.emitter.emit('user.deleted', user);
    }
    async onUserUpdated(user) {
        const { enabled, customerIo } = this.config.metrics;
        if (enabled && customerIo?.token) {
            const payload = {
                name: user.name,
                email: user.email,
                created_at: Number(user.createdAt) / 1000,
            };
            try {
                await fetch(`https://track.customer.io/api/v1/customers/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Basic ${customerIo.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            }
            catch (e) {
                this.logger.error('Failed to publish user update event:', e);
            }
        }
    }
    async onUserDeleted(user) {
        const { enabled, customerIo } = this.config.metrics;
        if (enabled && customerIo?.token) {
            try {
                if (user.emailVerifiedAt) {
                    // suppress email if email is verified
                    await fetch(`https://track.customer.io/api/v1/customers/${user.email}/suppress`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Basic ${customerIo.token}`,
                        },
                    });
                }
                await fetch(`https://track.customer.io/api/v1/customers/${user.id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Basic ${customerIo.token}` },
                });
            }
            catch (e) {
                this.logger.error('Failed to publish user delete event:', e);
            }
        }
    }
};
__decorate([
    OnEvent('user.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "onUserUpdated", null);
__decorate([
    OnEvent('user.deleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "onUserDeleted", null);
UserService = UserService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config,
        PrismaClient,
        EventEmitter])
], UserService);
export { UserService };
//# sourceMappingURL=service.js.map