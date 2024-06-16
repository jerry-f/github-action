import { RuntimeConfig, RuntimeConfigType } from '@prisma/client';
import { Config, DeploymentType, URLHelper } from '../../fundamentals';
import { ServerFlags } from './config';
import { ServerFeature } from './types';
export declare function ADD_ENABLED_FEATURES(feature: ServerFeature): void;
export declare class PasswordLimitsType {
    minLength: number;
    maxLength: number;
}
export declare class CredentialsRequirementType {
    password: PasswordLimitsType;
}
export declare class ServerConfigType {
    name: string;
    version: string;
    baseUrl: string;
    type: DeploymentType;
    /**
     * @deprecated
     */
    flavor: string;
    features: ServerFeature[];
    enableTelemetry: boolean;
}
export declare class ServerRuntimeConfigType implements Partial<RuntimeConfig> {
    id: string;
    module: string;
    key: string;
    description: string;
    value: any;
    type: RuntimeConfigType;
    updatedAt: Date;
}
export declare class ServerFlagsType implements ServerFlags {
    earlyAccessControl: boolean;
    syncClientVersionCheck: boolean;
}
export declare class ServerConfigResolver {
    private readonly config;
    private readonly url;
    constructor(config: Config, url: URLHelper);
    serverConfig(): ServerConfigType;
    credentialsRequirement(): Promise<{
        password: {
            minLength: number;
            maxLength: number;
        };
    }>;
    flags(): Promise<ServerFlagsType>;
}
export declare class ServerRuntimeConfigResolver {
    private readonly config;
    constructor(config: Config);
    serverRuntimeConfig(): Promise<ServerRuntimeConfigType[]>;
    updateRuntimeConfig(id: string, value: any): Promise<ServerRuntimeConfigType>;
    updateRuntimeConfigs(updates: any): Promise<ServerRuntimeConfigType[]>;
}
//# sourceMappingURL=resolver.d.ts.map