import { RedisOptions } from 'ioredis';
import { ModuleConfig } from '../../fundamentals/config';
declare module '../config' {
    interface PluginsConfig {
        redis: ModuleConfig<RedisOptions>;
    }
}
//# sourceMappingURL=config.d.ts.map