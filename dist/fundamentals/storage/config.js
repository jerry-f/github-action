import { homedir } from 'node:os';
import { join } from 'node:path';
import { defineStartupConfig } from '../config';
defineStartupConfig('storageProviders', {
    fs: {
        path: join(homedir(), '.affine/storage'),
    },
});
export function getDefaultAFFiNEStorageConfig() {
    return {
        providers: {
            fs: {
                path: join(homedir(), '.affine/storage'),
            },
        },
        storages: {
            avatar: {
                provider: 'fs',
                bucket: 'avatars',
                publicLinkFactory: key => `/api/avatars/${key}`,
            },
            blob: {
                provider: 'fs',
                bucket: 'blobs',
            },
            copilot: {
                provider: 'fs',
                bucket: 'copilot',
            },
        },
    };
}
//# sourceMappingURL=config.js.map