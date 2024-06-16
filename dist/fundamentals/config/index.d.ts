/// <reference types="./global.d.ts" />
import { DynamicModule } from '@nestjs/common';
import { AFFiNEConfig } from './def';
export * from './def';
export * from './default';
export { applyEnvToConfig, parseEnvValue } from './env';
export * from './provider';
export { defineRuntimeConfig, defineStartupConfig } from './register';
export type { AppConfig, ConfigItem, ModuleConfig } from './types';
export declare class ConfigModule {
    static forRoot: (override?: DeepPartial<AFFiNEConfig>) => DynamicModule;
}
//# sourceMappingURL=index.d.ts.map