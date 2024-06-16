import { ModuleConfig } from '../../fundamentals/config';
export interface ServerFlags {
    earlyAccessControl: boolean;
    syncClientVersionCheck: boolean;
}
declare module '../../fundamentals/config' {
    interface AppConfig {
        flags: ModuleConfig<never, ServerFlags>;
    }
}
//# sourceMappingURL=config.d.ts.map