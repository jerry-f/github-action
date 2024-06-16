export class RedisCache {
    constructor(redis) {
        this.redis = redis;
    }
    // standard operation
    async get(key) {
        return this.redis
            .get(key)
            .then(v => {
            if (v) {
                return JSON.parse(v);
            }
            return undefined;
        })
            .catch(() => undefined);
    }
    async set(key, value, opts = {}) {
        if (opts.ttl) {
            return this.redis
                .set(key, JSON.stringify(value), 'PX', opts.ttl)
                .then(() => true)
                .catch(() => false);
        }
        return this.redis
            .set(key, JSON.stringify(value))
            .then(() => true)
            .catch(() => false);
    }
    async increase(key, count = 1) {
        return this.redis.incrby(key, count).catch(() => 0);
    }
    async decrease(key, count = 1) {
        return this.redis.decrby(key, count).catch(() => 0);
    }
    async setnx(key, value, opts = {}) {
        if (opts.ttl) {
            return this.redis
                .set(key, JSON.stringify(value), 'PX', opts.ttl, 'NX')
                .then(v => !!v)
                .catch(() => false);
        }
        return this.redis
            .set(key, JSON.stringify(value), 'NX')
            .then(v => !!v)
            .catch(() => false);
    }
    async delete(key) {
        return this.redis
            .del(key)
            .then(v => v > 0)
            .catch(() => false);
    }
    async has(key) {
        return this.redis
            .exists(key)
            .then(v => v > 0)
            .catch(() => false);
    }
    async ttl(key) {
        return this.redis.ttl(key).catch(() => 0);
    }
    async expire(key, ttl) {
        return this.redis
            .pexpire(key, ttl)
            .then(v => v > 0)
            .catch(() => false);
    }
    // list operations
    async pushBack(key, ...values) {
        return this.redis
            .rpush(key, ...values.map(v => JSON.stringify(v)))
            .catch(() => 0);
    }
    async pushFront(key, ...values) {
        return this.redis
            .lpush(key, ...values.map(v => JSON.stringify(v)))
            .catch(() => 0);
    }
    async len(key) {
        return this.redis.llen(key).catch(() => 0);
    }
    async list(key, start, end) {
        return this.redis
            .lrange(key, start, end)
            .then(data => data.map(v => JSON.parse(v)))
            .catch(() => []);
    }
    async popFront(key, count = 1) {
        return this.redis
            .lpop(key, count)
            .then(data => (data ?? []).map(v => JSON.parse(v)))
            .catch(() => []);
    }
    async popBack(key, count = 1) {
        return this.redis
            .rpop(key, count)
            .then(data => (data ?? []).map(v => JSON.parse(v)))
            .catch(() => []);
    }
    // map operations
    async mapSet(map, key, value) {
        return this.redis
            .hset(map, key, JSON.stringify(value))
            .then(v => v > 0)
            .catch(() => false);
    }
    async mapIncrease(map, key, count = 1) {
        return this.redis.hincrby(map, key, count);
    }
    async mapDecrease(map, key, count = 1) {
        return this.redis.hincrby(map, key, -count);
    }
    async mapGet(map, key) {
        return this.redis
            .hget(map, key)
            .then(v => (v ? JSON.parse(v) : undefined))
            .catch(() => undefined);
    }
    async mapDelete(map, key) {
        return this.redis
            .hdel(map, key)
            .then(v => v > 0)
            .catch(() => false);
    }
    async mapKeys(map) {
        return this.redis.hkeys(map).catch(() => []);
    }
    async mapRandomKey(map) {
        return this.redis
            .hrandfield(map, 1)
            .then(v => typeof v === 'string'
            ? v
            : Array.isArray(v)
                ? v[0]
                : undefined)
            .catch(() => undefined);
    }
    async mapLen(map) {
        return this.redis.hlen(map).catch(() => 0);
    }
}
//# sourceMappingURL=cache.js.map