import { defineStartupConfig } from '../../fundamentals/config';
defineStartupConfig('plugins.copilot', {
    storage: {
        provider: 'fs',
        bucket: 'copilot',
    },
});
//# sourceMappingURL=config.js.map