var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CopilotWorkflowService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PromptService } from '../prompt';
import { CopilotProviderService } from '../providers';
import { WorkflowGraphs } from './graph';
import { WorkflowNode } from './node';
import { CopilotWorkflow } from './workflow';
let CopilotWorkflowService = CopilotWorkflowService_1 = class CopilotWorkflowService {
    constructor(prompt, provider) {
        this.prompt = prompt;
        this.provider = provider;
        this.logger = new Logger(CopilotWorkflowService_1.name);
    }
    initWorkflow({ name, graph }) {
        const workflow = new Map();
        for (const nodeData of graph) {
            const { edges: _, ...data } = nodeData;
            const node = new WorkflowNode(data);
            workflow.set(node.id, node);
        }
        // add edges
        for (const nodeData of graph) {
            const node = workflow.get(nodeData.id);
            if (!node) {
                this.logger.error(`Failed to init workflow ${name}: node ${nodeData.id} not found`);
                throw new Error(`Node ${nodeData.id} not found`);
            }
            for (const edgeId of nodeData.edges) {
                const edge = workflow.get(edgeId);
                if (!edge) {
                    this.logger.error(`Failed to init workflow ${name}: edge ${edgeId} not found in node ${nodeData.id}`);
                    throw new Error(`Edge ${edgeId} not found`);
                }
                node.addEdge(edge);
            }
        }
        return workflow;
    }
    // todo: get workflow from database
    async getWorkflow(graphName) {
        const graph = WorkflowGraphs.find(g => g.name === graphName);
        if (!graph) {
            throw new Error(`Graph ${graphName} not found`);
        }
        return this.initWorkflow(graph);
    }
    async *runGraph(params, graphName, options) {
        const workflowGraph = await this.getWorkflow(graphName);
        const workflow = new CopilotWorkflow(this.prompt, this.provider, workflowGraph);
        for await (const result of workflow.runGraph(params, options)) {
            yield result;
        }
    }
};
CopilotWorkflowService = CopilotWorkflowService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PromptService,
        CopilotProviderService])
], CopilotWorkflowService);
export { CopilotWorkflowService };
//# sourceMappingURL=index.js.map