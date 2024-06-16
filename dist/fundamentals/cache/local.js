import Keyv from 'keyv';
export class LocalCache {
    constructor(opts = {}) {
        this.kv = new Keyv(opts);
    }
    // standard operation
    async get(key) {
        return this.kv.get(key).catch(() => undefined);
    }
    async set(key, value, opts = {}) {
        return this.kv
            .set(key, value, opts.ttl)
            .then(() => true)
            .catch(() => false);
    }
    async setnx(key, value, opts) {
        if (!(await this.has(key))) {
            return this.set(key, value, opts);
        }
        return false;
    }
    async increase(key, count = 1) {
        const prev = (await this.get(key)) ?? 0;
        if (typeof prev !== 'number') {
            throw new Error(`Expect a Number keyed by ${key}, but found ${typeof prev}`);
        }
        const curr = prev + count;
        return (await this.set(key, curr)) ? curr : prev;
    }
    async decrease(key, count = 1) {
        return this.increase(key, -count);
    }
    async delete(key) {
        return this.kv.delete(key).catch(() => false);
    }
    async has(key) {
        return this.kv.has(key).catch(() => false);
    }
    async ttl(key) {
        return this.kv
            .get(key, { raw: true })
            .then(raw => (raw?.expires ? raw.expires - Date.now() : Infinity))
            .catch(() => 0);
    }
    async expire(key, ttl) {
        const value = await this.kv.get(key);
        return this.set(key, value, { ttl });
    }
    // list operations
    async getArray(key) {
        const raw = await this.kv.get(key, { raw: true });
        if (raw && !Array.isArray(raw.value)) {
            throw new Error(`Expect an Array keyed by ${key}, but found ${raw.value}`);
        }
        return raw;
    }
    async setArray(key, value, opts = {}) {
        return this.set(key, value, opts).then(() => value.length);
    }
    async pushBack(key, ...values) {
        let list = [];
        let ttl = undefined;
        const raw = await this.getArray(key);
        if (raw) {
            list = raw.value;
            if (raw.expires) {
                ttl = raw.expires - Date.now();
            }
        }
        list = list.concat(values);
        return this.setArray(key, list, { ttl });
    }
    async pushFront(key, ...values) {
        let list = [];
        let ttl = undefined;
        const raw = await this.getArray(key);
        if (raw) {
            list = raw.value;
            if (raw.expires) {
                ttl = raw.expires - Date.now();
            }
        }
        list = values.concat(list);
        return this.setArray(key, list, { ttl });
    }
    async len(key) {
        return this.getArray(key).then(v => v?.value.length ?? 0);
    }
    /**
     * list array elements with `[start, end]`
     * the end indice is inclusive
     */
    async list(key, start, end) {
        const raw = await this.getArray(key);
        if (raw?.value) {
            start = (raw.value.length + start) % raw.value.length;
            end = ((raw.value.length + end) % raw.value.length) + 1;
            return raw.value.slice(start, end);
        }
        else {
            return [];
        }
    }
    async trim(key, start, end) {
        const raw = await this.getArray(key);
        if (raw) {
            start = (raw.value.length + start) % raw.value.length;
            // make negative end index work, and end indice is inclusive
            end = ((raw.value.length + end) % raw.value.length) + 1;
            const result = raw.value.splice(start, end);
            await this.set(key, raw.value, {
                ttl: raw.expires ? raw.expires - Date.now() : undefined,
            });
            return result;
        }
        return [];
    }
    async popFront(key, count = 1) {
        return this.trim(key, 0, count - 1);
    }
    async popBack(key, count = 1) {
        return this.trim(key, -count, count - 1);
    }
    // map operations
    async getMap(map) {
        const raw = await this.kv.get(map, { raw: true });
        if (raw) {
            if (typeof raw.value !== 'object') {
                throw new Error(`Expect an Object keyed by ${map}, but found ${typeof raw}`);
            }
            if (Array.isArray(raw.value)) {
                throw new Error(`Expect an Object keyed by ${map}, but found an Array`);
            }
        }
        return raw;
    }
    async setMap(map, value, opts = {}) {
        return this.kv.set(map, value, opts.ttl).then(() => true);
    }
    async mapGet(map, key) {
        const raw = await this.getMap(map);
        if (raw?.value) {
            return raw.value[key];
        }
        return undefined;
    }
    async mapSet(map, key, value) {
        const raw = await this.getMap(map);
        const data = raw?.value ?? {};
        data[key] = value;
        return this.setMap(map, data, {
            ttl: raw?.expires ? raw.expires - Date.now() : undefined,
        });
    }
    async mapDelete(map, key) {
        const raw = await this.getMap(map);
        if (raw?.value) {
            delete raw.value[key];
            return this.setMap(map, raw.value, {
                ttl: raw.expires ? raw.expires - Date.now() : undefined,
            });
        }
        return false;
    }
    async mapIncrease(map, key, count = 1) {
        const prev = (await this.mapGet(map, key)) ?? 0;
        if (typeof prev !== 'number') {
            throw new Error(`Expect a Number keyed by ${key}, but found ${typeof prev}`);
        }
        const curr = prev + count;
        return (await this.mapSet(map, key, curr)) ? curr : prev;
    }
    async mapDecrease(map, key, count = 1) {
        return this.mapIncrease(map, key, -count);
    }
    async mapKeys(map) {
        const raw = await this.getMap(map);
        if (raw) {
            return Object.keys(raw.value);
        }
        return [];
    }
    async mapRandomKey(map) {
        const keys = await this.mapKeys(map);
        return keys[Math.floor(Math.random() * keys.length)];
    }
    async mapLen(map) {
        const raw = await this.getMap(map);
        return raw ? Object.keys(raw.value).length : 0;
    }
}
//# sourceMappingURL=local.js.map