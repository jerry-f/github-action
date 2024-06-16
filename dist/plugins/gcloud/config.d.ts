import { ModuleConfig } from '../../fundamentals/config';
export interface GCloudConfig {
    enabled: boolean;
}
declare module '../config' {
    interface PluginsConfig {
        gcloud: ModuleConfig<GCloudConfig>;
    }
}
//# sourceMappingURL=config.d.ts.map