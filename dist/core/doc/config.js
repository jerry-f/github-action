import { defineRuntimeConfig, defineStartupConfig, } from '../../fundamentals/config';
defineStartupConfig('doc', {
    manager: {
        enableUpdateAutoMerging: true,
        updatePollInterval: 1000,
        maxUpdatesPullCount: 100,
    },
    history: {
        interval: 1000,
    },
});
defineRuntimeConfig('doc', {
    experimentalMergeWithYOcto: {
        desc: 'Use `y-octo` to merge updates at the same time when merging using Yjs.',
        default: false,
    },
});
//# sourceMappingURL=config.js.map