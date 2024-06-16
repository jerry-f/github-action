import { ModuleConfig } from '../config';
export type ThrottlerType = 'default' | 'strict';
type ThrottlerStartupConfigurations = {
    [key in ThrottlerType]: {
        ttl: number;
        limit: number;
    };
};
declare module '../config' {
    interface AppConfig {
        throttler: ModuleConfig<ThrottlerStartupConfigurations>;
    }
}
export {};
//# sourceMappingURL=config.d.ts.map