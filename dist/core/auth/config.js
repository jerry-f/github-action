import { defineRuntimeConfig, defineStartupConfig, } from '../../fundamentals/config';
defineStartupConfig('auth', {
    session: {
        ttl: 60 * 60 * 24 * 15, // 15 days
        ttr: 60 * 60 * 24 * 7, // 7 days
    },
    accessToken: {
        ttl: 60 * 60 * 24 * 7, // 7 days
        refreshTokenTtl: 60 * 60 * 24 * 30, // 30 days
    },
});
defineRuntimeConfig('auth', {
    allowSignup: {
        desc: 'Whether allow new registrations',
        default: true,
    },
    requireEmailVerification: {
        desc: 'Whether require email verification before accessing restricted resources',
        default: true,
    },
    'password.min': {
        desc: 'The minimum length of user password',
        default: 8,
    },
    'password.max': {
        desc: 'The maximum length of user password',
        default: 32,
    },
});
//# sourceMappingURL=config.js.map