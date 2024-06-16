import { merge } from 'lodash-es';
import { Config } from './provider';
import { Runtime } from './runtime/service';
export * from './def';
export * from './default';
export { applyEnvToConfig, parseEnvValue } from './env';
export * from './provider';
export { defineRuntimeConfig, defineStartupConfig } from './register';
function createConfigProvider(override) {
    return {
        provide: Config,
        useFactory: (runtime) => {
            return Object.freeze(merge({}, globalThis.AFFiNE, override, { runtime }));
        },
        inject: [Runtime],
    };
}
export class ConfigModule {
    static { this.forRoot = (override) => {
        const provider = createConfigProvider(override);
        return {
            global: true,
            module: ConfigModule,
            providers: [provider, Runtime],
            exports: [provider],
        };
    }; }
}
//# sourceMappingURL=index.js.map