/// <reference types="./global.d.ts" />
import { DynamicModule } from '@nestjs/common';
import { CacheModule } from './fundamentals/cache';
import { AFFiNEConfig } from './fundamentals/config';
import { MetricsModule } from './fundamentals/metrics';
export declare const FunctionalityModules: (typeof CacheModule | DynamicModule | typeof MetricsModule)[];
export declare class AppModuleBuilder {
    private readonly config;
    private readonly modules;
    constructor(config: AFFiNEConfig);
    use(...modules: AFFiNEModule[]): this;
    useIf(predicator: (config: AFFiNEConfig) => boolean, ...modules: AFFiNEModule[]): this;
    compile(): {
        new (): {};
    };
}
export declare const AppModule: {
    new (): {};
};
//# sourceMappingURL=app.module.d.ts.map