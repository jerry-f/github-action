import { defineRuntimeConfig } from '../../fundamentals/config';
defineRuntimeConfig('flags', {
    earlyAccessControl: {
        desc: 'Only allow users with early access features to access the app',
        default: false,
    },
    syncClientVersionCheck: {
        desc: 'Only allow client with exact the same version with server to establish sync connections',
        default: false,
    },
});
//# sourceMappingURL=config.js.map