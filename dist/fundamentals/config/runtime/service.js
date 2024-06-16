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
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
import { BadRequestException, forwardRef, Inject, Injectable, Logger, } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { difference, keyBy } from 'lodash-es';
import { Cache } from '../../cache';
import { defer } from '../../utils/promise';
import { defaultRuntimeConfig, runtimeConfigType } from '../register';
function validateConfigType(key, value) {
    const config = defaultRuntimeConfig[key];
    if (!config) {
        throw new BadRequestException(`Unknown runtime config key '${key}'`);
    }
    const want = config.type;
    const get = runtimeConfigType(value);
    if (get !== want) {
        throw new BadRequestException(`Invalid runtime config type for '${key}',  want '${want}', but get '${get}'`);
    }
}
/**
 * runtime.fetch(k) // v1
 * runtime.fetchAll(k1, k2, k3) // [v1, v2, v3]
 * runtime.set(k, v)
 * runtime.update(k, (v) => {
 *   v.xxx = 'yyy';
 *   return v
 * })
 */
let Runtime = class Runtime {
    constructor(db, cache) {
        this.db = db;
        this.cache = cache;
        this.logger = new Logger('App:RuntimeConfig');
    }
    async onApplicationBootstrap() {
        await this.upgradeDB();
    }
    async fetch(k) {
        const cached = await this.loadCache(k);
        if (cached !== undefined) {
            return cached;
        }
        const dbValue = await this.loadDb(k);
        if (dbValue === undefined) {
            throw new Error(`Runtime config ${k} not found`);
        }
        await this.setCache(k, dbValue);
        return dbValue;
    }
    async fetchAll(selector) {
        const keys = Object.keys(selector);
        if (keys.length === 0) {
            return {};
        }
        const records = await this.db.runtimeConfig.findMany({
            select: {
                id: true,
                value: true,
            },
            where: {
                id: {
                    in: keys,
                },
                deletedAt: null,
            },
        });
        const keyed = keyBy(records, 'id');
        return keys.reduce((ret, key) => {
            ret[key] = keyed[key]?.value ?? defaultRuntimeConfig[key].value;
            return ret;
        }, {});
    }
    async list(module) {
        return await this.db.runtimeConfig.findMany({
            where: module ? { module, deletedAt: null } : { deletedAt: null },
        });
    }
    async set(key, value) {
        validateConfigType(key, value);
        const config = await this.db.runtimeConfig.update({
            where: {
                id: key,
                deletedAt: null,
            },
            data: {
                value: value,
            },
        });
        await this.setCache(key, config.value);
        return config;
    }
    async update(k, modifier) {
        const data = await this.fetch(k);
        const updated = await modifier(data);
        await this.set(k, updated);
        return updated;
    }
    async loadDb(k) {
        const v = await this.db.runtimeConfig.findFirst({
            where: {
                id: k,
                deletedAt: null,
            },
        });
        if (v) {
            return v.value;
        }
        else {
            const record = await this.db.runtimeConfig.create({
                data: defaultRuntimeConfig[k],
            });
            return record.value;
        }
    }
    async loadCache(k) {
        return this.cache.get(`SERVER_RUNTIME:${k}`);
    }
    async setCache(k, v) {
        return this.cache.set(`SERVER_RUNTIME:${k}`, v, { ttl: 60 * 1000 });
    }
    /**
     * Upgrade the DB with latest runtime configs
     */
    async upgradeDB() {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const existingConfig = await this.db.runtimeConfig.findMany({
                select: {
                    id: true,
                },
                where: {
                    deletedAt: null,
                },
            });
            const defined = Object.keys(defaultRuntimeConfig);
            const existing = existingConfig.map(c => c.id);
            const newConfigs = difference(defined, existing);
            const deleteConfigs = difference(existing, defined);
            if (!newConfigs.length && !deleteConfigs.length) {
                return;
            }
            this.logger.log(`Found runtime config changes, upgrading...`);
            const acquired = await this.cache.setnx('runtime:upgrade', 1, {
                ttl: 10 * 60 * 1000,
            });
            const _ = __addDisposableResource(env_1, defer(async () => {
                await this.cache.delete('runtime:upgrade');
            }), true);
            if (acquired) {
                for (const key of newConfigs) {
                    await this.db.runtimeConfig.upsert({
                        create: defaultRuntimeConfig[key],
                        // old deleted setting should be restored
                        update: {
                            ...defaultRuntimeConfig[key],
                            deletedAt: null,
                        },
                        where: {
                            id: key,
                        },
                    });
                }
                await this.db.runtimeConfig.updateMany({
                    where: {
                        id: {
                            in: deleteConfigs,
                        },
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });
            }
            this.logger.log('Upgrade completed');
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            const result_1 = __disposeResources(env_1);
            if (result_1)
                await result_1;
        }
    }
};
Runtime = __decorate([
    Injectable(),
    __param(1, Inject(forwardRef(() => Cache))),
    __metadata("design:paramtypes", [PrismaClient,
        Cache])
], Runtime);
export { Runtime };
//# sourceMappingURL=service.js.map