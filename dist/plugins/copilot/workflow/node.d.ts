import { PromptService } from '../prompt';
import { CopilotProviderService } from '../providers';
import { CopilotChatOptions } from '../types';
import { NodeData, WorkflowNodeState, WorkflowResult } from './types';
export declare class WorkflowNode {
    private readonly data;
    private readonly edges;
    private readonly parents;
    private prompt;
    private provider;
    constructor(data: NodeData);
    get id(): string;
    get name(): string;
    get config(): NodeData;
    get parent(): WorkflowNode[];
    private set parent(value);
    addEdge(node: WorkflowNode): number;
    initNode(prompt: PromptService, provider: CopilotProviderService): Promise<void>;
    private evaluateCondition;
    private getStreamProvider;
    private getProvider;
    next(params: WorkflowNodeState, options?: CopilotChatOptions): AsyncIterable<WorkflowResult>;
}
//# sourceMappingURL=node.d.ts.map