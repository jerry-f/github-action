import type { WorkflowNode } from './node';
export declare enum WorkflowNodeType {
    Basic = 0,
    Decision = 1
}
export type NodeData = {
    id: string;
    name: string;
} & ({
    nodeType: WorkflowNodeType.Basic;
    promptName: string;
    type: 'text' | 'image';
    paramKey?: string;
} | {
    nodeType: WorkflowNodeType.Decision;
    condition: string;
});
export type WorkflowNodeState = Record<string, string>;
export type WorkflowGraphData = Array<NodeData & {
    edges: string[];
}>;
export type WorkflowGraphList = Array<{
    name: string;
    graph: WorkflowGraphData;
}>;
export declare enum WorkflowResultType {
    StartRun = 0,
    EndRun = 1,
    Params = 2,
    Content = 3
}
export type WorkflowResult = {
    type: WorkflowResultType.StartRun;
    nodeId: string;
} | {
    type: WorkflowResultType.EndRun;
    nextNode: WorkflowNode;
} | {
    type: WorkflowResultType.Params;
    params: Record<string, string | string[]>;
} | {
    type: WorkflowResultType.Content;
    nodeId: string;
    content: string;
    passthrough?: boolean;
};
export type WorkflowGraph = Map<string, WorkflowNode>;
//# sourceMappingURL=types.d.ts.map