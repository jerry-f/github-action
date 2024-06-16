import { ModuleConfig } from '../config';
declare module '../config' {
    interface AppConfig {
        crypto: ModuleConfig<{
            secret: {
                publicKey: string;
                privateKey: string;
            };
        }>;
    }
}
//# sourceMappingURL=config.d.ts.map