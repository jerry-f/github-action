/// <reference types="./global.d.ts" />
import { ModuleStartupConfigDescriptions } from '../fundamentals/config/types';
export interface PluginsConfig {
}
export type AvailablePlugins = keyof PluginsConfig;
declare module '../fundamentals/config' {
    interface AppConfig {
        plugins: PluginsConfig;
    }
    interface AppPluginsConfig {
        use<Plugin extends AvailablePlugins>(plugin: Plugin, config?: DeepPartial<ModuleStartupConfigDescriptions<PluginsConfig[Plugin]>>): void;
        plugins: {
            /**
             * @deprecated use `AFFiNE.use` instead
             */
            use<Plugin extends AvailablePlugins>(plugin: Plugin, config?: DeepPartial<ModuleStartupConfigDescriptions<PluginsConfig[Plugin]>>): void;
        };
    }
}
//# sourceMappingURL=config.d.ts.map