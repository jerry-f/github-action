import { Prisma, RuntimeConfigType } from '@prisma/client';
import { AppModulesConfigDef, AppStartupConfig, ModuleRuntimeConfigDescriptions, ModuleStartupConfigDescriptions } from './types';
export declare const defaultStartupConfig: AppStartupConfig;
export declare const defaultRuntimeConfig: Record<string, Prisma.RuntimeConfigCreateInput>;
export declare function runtimeConfigType(val: any): RuntimeConfigType;
export declare function defineStartupConfig<T extends keyof AppModulesConfigDef>(module: T, configs: ModuleStartupConfigDescriptions<AppModulesConfigDef[T]>): void;
export declare function defineRuntimeConfig<T extends keyof AppModulesConfigDef>(module: T, configs: ModuleRuntimeConfigDescriptions<T>): void;
//# sourceMappingURL=register.d.ts.map