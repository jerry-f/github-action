var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CopilotProviderService_1;
import assert from 'node:assert';
import { Injectable, Logger } from '@nestjs/common';
import { Config } from '../../../fundamentals';
// registered provider factory
const COPILOT_PROVIDER = new Map();
// map of capabilities to providers
const PROVIDER_CAPABILITY_MAP = new Map();
// config assertions for providers
const ASSERT_CONFIG = new Map();
export function registerCopilotProvider(provider) {
    const type = provider.type;
    const factory = (config, logger) => {
        const providerConfig = config.plugins.copilot?.[type];
        if (!provider.assetsConfig(providerConfig)) {
            throw new Error(`Invalid configuration for copilot provider ${type}: ${JSON.stringify(providerConfig)}`);
        }
        const instance = new provider(providerConfig);
        logger.debug(`Copilot provider ${type} registered, capabilities: ${provider.capabilities.join(', ')}`);
        return instance;
    };
    // register the provider
    COPILOT_PROVIDER.set(type, factory);
    // register the provider capabilities
    for (const capability of provider.capabilities) {
        const providers = PROVIDER_CAPABILITY_MAP.get(capability) || [];
        if (!providers.includes(type)) {
            providers.push(type);
        }
        PROVIDER_CAPABILITY_MAP.set(capability, providers);
    }
    // register the provider config assertion
    ASSERT_CONFIG.set(type, (config) => {
        assert(config.plugins.copilot);
        const providerConfig = config.plugins.copilot[type];
        if (!providerConfig)
            return false;
        return provider.assetsConfig(providerConfig);
    });
}
export function unregisterCopilotProvider(type) {
    COPILOT_PROVIDER.delete(type);
    ASSERT_CONFIG.delete(type);
    for (const providers of PROVIDER_CAPABILITY_MAP.values()) {
        const index = providers.indexOf(type);
        if (index !== -1) {
            providers.splice(index, 1);
        }
    }
}
/// Asserts that the config is valid for any registered providers
export function assertProvidersConfigs(config) {
    return (Array.from(ASSERT_CONFIG.values()).findIndex(assertConfig => assertConfig(config)) !== -1);
}
let CopilotProviderService = CopilotProviderService_1 = class CopilotProviderService {
    constructor(config) {
        this.config = config;
        this.logger = new Logger(CopilotProviderService_1.name);
        this.cachedProviders = new Map();
    }
    create(provider) {
        assert(this.config.plugins.copilot);
        const providerFactory = COPILOT_PROVIDER.get(provider);
        if (!providerFactory) {
            throw new Error(`Unknown copilot provider type: ${provider}`);
        }
        return providerFactory(this.config, this.logger);
    }
    getProvider(provider) {
        if (!this.cachedProviders.has(provider)) {
            this.cachedProviders.set(provider, this.create(provider));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.cachedProviders.get(provider);
    }
    async getProviderByCapability(capability, model, prefer) {
        const providers = PROVIDER_CAPABILITY_MAP.get(capability);
        if (Array.isArray(providers) && providers.length) {
            let selectedProvider = prefer;
            let currentIndex = -1;
            if (!selectedProvider) {
                currentIndex = 0;
                selectedProvider = providers[currentIndex];
            }
            while (selectedProvider) {
                // find first provider that supports the capability and model
                if (providers.includes(selectedProvider)) {
                    const provider = this.getProvider(selectedProvider);
                    if (provider.getCapabilities().includes(capability)) {
                        if (model) {
                            if (await provider.isModelAvailable(model)) {
                                return provider;
                            }
                        }
                        else {
                            return provider;
                        }
                    }
                }
                currentIndex += 1;
                selectedProvider = providers[currentIndex];
            }
        }
        return null;
    }
    async getProviderByModel(model, prefer) {
        const providers = Array.from(COPILOT_PROVIDER.keys());
        if (providers.length) {
            let selectedProvider = prefer;
            let currentIndex = -1;
            if (!selectedProvider) {
                currentIndex = 0;
                selectedProvider = providers[currentIndex];
            }
            while (selectedProvider) {
                const provider = this.getProvider(selectedProvider);
                if (await provider.isModelAvailable(model)) {
                    return provider;
                }
                currentIndex += 1;
                selectedProvider = providers[currentIndex];
            }
        }
        return null;
    }
};
CopilotProviderService = CopilotProviderService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config])
], CopilotProviderService);
export { CopilotProviderService };
export { FalProvider } from './fal';
export { OpenAIProvider } from './openai';
//# sourceMappingURL=index.js.map