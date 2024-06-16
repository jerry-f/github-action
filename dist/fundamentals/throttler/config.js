import { defineStartupConfig } from '../config';
defineStartupConfig('throttler', {
    default: {
        ttl: 60,
        limit: 120,
    },
    strict: {
        ttl: 60,
        limit: 20,
    },
});
//# sourceMappingURL=config.js.map