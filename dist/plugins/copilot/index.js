var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import './config';
import { ServerFeature } from '../../core/config';
import { FeatureModule } from '../../core/features';
import { QuotaModule } from '../../core/quota';
import { PermissionService } from '../../core/workspaces/permission';
import { Plugin } from '../registry';
import { CopilotController } from './controller';
import { ChatMessageCache } from './message';
import { PromptService } from './prompt';
import { assertProvidersConfigs, CopilotProviderService, FalProvider, OpenAIProvider, registerCopilotProvider, } from './providers';
import { CopilotResolver, PromptsManagementResolver, UserCopilotResolver, } from './resolver';
import { ChatSessionService } from './session';
import { CopilotStorage } from './storage';
import { CopilotWorkflowService } from './workflow';
registerCopilotProvider(FalProvider);
registerCopilotProvider(OpenAIProvider);
let CopilotModule = class CopilotModule {
};
CopilotModule = __decorate([
    Plugin({
        name: 'copilot',
        imports: [FeatureModule, QuotaModule],
        providers: [
            PermissionService,
            ChatSessionService,
            CopilotResolver,
            ChatMessageCache,
            UserCopilotResolver,
            PromptService,
            CopilotProviderService,
            CopilotStorage,
            PromptsManagementResolver,
            CopilotWorkflowService,
        ],
        controllers: [CopilotController],
        contributesTo: ServerFeature.Copilot,
        if: config => {
            if (config.flavor.graphql) {
                return assertProvidersConfigs(config);
            }
            return false;
        },
    })
], CopilotModule);
export { CopilotModule };
//# sourceMappingURL=index.js.map