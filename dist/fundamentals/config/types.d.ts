/// <reference types="./global.d.ts" />
import { Join, PathType } from '../utils/types';
export type ConfigItem<T> = T & {
    __type: 'ConfigItem';
};
type ConfigDef = Record<string, any> | never;
export interface ModuleConfig<Startup extends ConfigDef = never, Runtime extends ConfigDef = never> {
    startup: Startup;
    runtime: Runtime;
}
export type RuntimeConfigDescription<T> = {
    desc: string;
    default: T;
};
type ConfigItemLeaves<T, P extends string = ''> = T extends Record<string, any> ? {
    [K in keyof T]: K extends string ? T[K] extends {
        __type: 'ConfigItem';
    } ? K : T[K] extends PrimitiveType ? K : Join<K, ConfigItemLeaves<T[K], P>> : never;
}[keyof T] : never;
type StartupConfigDescriptions<T extends ConfigDef> = {
    [K in keyof T]: T[K] extends Record<string, any> ? T[K] extends ConfigItem<infer V> ? V : T[K] : T[K];
};
type ModuleConfigLeaves<T, P extends string = ''> = T extends Record<string, any> ? {
    [K in keyof T]: K extends string ? T[K] extends ModuleConfig<any, any> ? K : Join<K, ModuleConfigLeaves<T[K], P>> : never;
}[keyof T] : never;
type FlattenModuleConfigs<T extends Record<string, any>> = {
    [K in ModuleConfigLeaves<T>]: PathType<T, K>;
};
type _AppStartupConfig<T extends Record<string, any>> = {
    [K in keyof T]: T[K] extends ModuleConfig<infer S, any> ? S : _AppStartupConfig<T[K]>;
};
export interface AppConfig {
}
export type AppModulesConfigDef = FlattenModuleConfigs<AppConfig>;
export type AppConfigModules = keyof AppModulesConfigDef;
export type AppStartupConfig = _AppStartupConfig<AppConfig>;
export type AppRuntimeConfigByModules = {
    [Module in keyof AppModulesConfigDef]: AppModulesConfigDef[Module] extends ModuleConfig<any, infer Runtime> ? Runtime extends never ? never : {
        [K in ConfigItemLeaves<Runtime>]: PathType<Runtime, K> extends infer Config ? Config extends ConfigItem<infer V> ? V : Config : never;
    } : never;
};
export type AppRuntimeConfigModules = {
    [Module in keyof AppRuntimeConfigByModules]: AppRuntimeConfigByModules[Module] extends never ? never : Module;
}[keyof AppRuntimeConfigByModules];
export type FlattenedAppRuntimeConfig = UnionToIntersection<{
    [Module in keyof AppRuntimeConfigByModules]: AppModulesConfigDef[Module] extends never ? never : {
        [K in keyof AppRuntimeConfigByModules[Module] as K extends string ? `${Module}/${K}` : never]: AppRuntimeConfigByModules[Module][K];
    };
}[keyof AppRuntimeConfigByModules]>;
export type ModuleStartupConfigDescriptions<T extends ModuleConfig<any, any>> = T extends ModuleConfig<infer S, any> ? S extends never ? undefined : StartupConfigDescriptions<S> : never;
export type ModuleRuntimeConfigDescriptions<Module extends keyof AppRuntimeConfigByModules> = AppModulesConfigDef[Module] extends never ? never : {
    [K in keyof AppRuntimeConfigByModules[Module]]: RuntimeConfigDescription<AppRuntimeConfigByModules[Module][K]>;
};
export {};
//# sourceMappingURL=types.d.ts.map