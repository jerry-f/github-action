/// <reference types="./global.d.ts" />
import { AFFiNEConfig } from './def';
import type { Runtime } from './runtime/service';
declare const Config_base: ConstructorOf<AFFiNEConfig>;
/**
 * @example
 *
 * import { Config } from '@affine/server'
 *
 * class TestConfig {
 *   constructor(private readonly config: Config) {}
 *   test() {
 *     return this.config.env
 *   }
 * }
 */
export declare class Config extends Config_base {
    runtime: Runtime;
}
export {};
//# sourceMappingURL=provider.d.ts.map