import { PromptService } from '../prompt';
import { CopilotProviderService } from '../providers';
import { CopilotChatOptions } from '../types';
export declare class CopilotWorkflowService {
    private readonly prompt;
    private readonly provider;
    private readonly logger;
    constructor(prompt: PromptService, provider: CopilotProviderService);
    private initWorkflow;
    private getWorkflow;
    runGraph(params: Record<string, string>, graphName: string, options?: CopilotChatOptions): AsyncIterable<string>;
}
//# sourceMappingURL=index.d.ts.map