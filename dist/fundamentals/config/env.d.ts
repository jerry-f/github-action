import type { AFFiNEConfig, EnvConfigType } from './def';
export declare function parseEnvValue(value: string | undefined, type: EnvConfigType): unknown;
export declare function applyEnvToConfig(rawConfig: AFFiNEConfig): void;
export declare function readEnv<T>(env: string, defaultValue: T, availableValues?: T[]): T;
//# sourceMappingURL=env.d.ts.map