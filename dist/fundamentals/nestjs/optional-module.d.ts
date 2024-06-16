import { DynamicModule, ModuleMetadata, Provider, Type } from '@nestjs/common';
import type { AFFiNEConfig, ConfigPaths } from '../config';
export interface OptionalModuleMetadata extends ModuleMetadata {
    /**
     * Only install module if given config paths are defined in AFFiNE config.
     */
    requires?: ConfigPaths[];
    /**
     * Only install module if the predication returns true.
     */
    if?: (config: AFFiNEConfig) => boolean;
    /**
     * Defines which feature will be enabled if the module installed.
     */
    contributesTo?: import('../../core/config').ServerFeature;
    /**
     * Defines which providers provided by other modules will be overridden if the module installed.
     */
    overrides?: Provider[];
}
type OptionalDynamicModule = DynamicModule & OptionalModuleMetadata;
export declare function OptionalModule(metadata: OptionalModuleMetadata): (target: Type) => void;
export declare function getOptionalModuleMetadata<T extends keyof OptionalModuleMetadata>(target: Type | OptionalDynamicModule, key: T): OptionalModuleMetadata[T];
export {};
//# sourceMappingURL=optional-module.d.ts.map