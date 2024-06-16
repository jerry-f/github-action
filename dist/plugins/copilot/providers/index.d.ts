import { AFFiNEConfig, Config } from '../../../fundamentals';
import { CopilotStartupConfigurations } from '../config';
import { CapabilityToCopilotProvider, CopilotCapability, CopilotProvider, CopilotProviderType } from '../types';
type CopilotProviderConfig = CopilotStartupConfigurations[keyof CopilotStartupConfigurations];
interface CopilotProviderDefinition<C extends CopilotProviderConfig> {
    new (config: C): CopilotProvider;
    readonly type: CopilotProviderType;
    readonly capabilities: CopilotCapability[];
    assetsConfig(config: C): boolean;
}
export declare function registerCopilotProvider<C extends CopilotProviderConfig = CopilotProviderConfig>(provider: CopilotProviderDefinition<C>): void;
export declare function unregisterCopilotProvider(type: CopilotProviderType): void;
export declare function assertProvidersConfigs(config: AFFiNEConfig): boolean;
export declare class CopilotProviderService {
    private readonly config;
    private readonly logger;
    constructor(config: Config);
    private readonly cachedProviders;
    private create;
    getProvider(provider: CopilotProviderType): CopilotProvider;
    getProviderByCapability<C extends CopilotCapability>(capability: C, model?: string, prefer?: CopilotProviderType): Promise<CapabilityToCopilotProvider[C] | null>;
    getProviderByModel<C extends CopilotCapability>(model: string, prefer?: CopilotProviderType): Promise<CapabilityToCopilotProvider[C] | null>;
}
export { FalProvider } from './fal';
export { OpenAIProvider } from './openai';
//# sourceMappingURL=index.d.ts.map