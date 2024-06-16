import { PromptService } from '../prompt';
import { CopilotProviderService } from '../providers';
import { CopilotChatOptions } from '../types';
import { WorkflowGraph } from './types';
export declare class CopilotWorkflow {
    private readonly prompt;
    private readonly provider;
    private readonly logger;
    private readonly rootNode;
    constructor(prompt: PromptService, provider: CopilotProviderService, workflow: WorkflowGraph);
    runGraph(params: Record<string, string>, options?: CopilotChatOptions): AsyncIterable<string>;
}
//# sourceMappingURL=workflow.d.ts.map