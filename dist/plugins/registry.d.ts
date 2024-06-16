/// <reference types="./global.d.ts" />
import { OptionalModuleMetadata } from '../fundamentals/nestjs';
import { AvailablePlugins } from './config';
export declare const REGISTERED_PLUGINS: Map<keyof import("./config").PluginsConfig, AFFiNEModule>;
export declare const ENABLED_PLUGINS: Set<keyof import("./config").PluginsConfig>;
interface PluginModuleMetadata extends OptionalModuleMetadata {
    name: AvailablePlugins;
}
export declare const Plugin: (options: PluginModuleMetadata) => (target: any) => void;
export declare function enablePlugin(plugin: AvailablePlugins, config?: any): void;
export {};
//# sourceMappingURL=registry.d.ts.map