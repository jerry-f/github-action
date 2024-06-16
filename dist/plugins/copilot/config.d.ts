import type { ClientOptions as OpenAIClientOptions } from 'openai';
import { ModuleConfig } from '../../fundamentals/config';
import { StorageConfig } from '../../fundamentals/storage/config';
import type { FalConfig } from './providers/fal';
export interface CopilotStartupConfigurations {
    openai?: OpenAIClientOptions;
    fal?: FalConfig;
    test?: never;
    unsplashKey?: string;
    storage: StorageConfig;
}
declare module '../config' {
    interface PluginsConfig {
        copilot: ModuleConfig<CopilotStartupConfigurations>;
    }
}
//# sourceMappingURL=config.d.ts.map