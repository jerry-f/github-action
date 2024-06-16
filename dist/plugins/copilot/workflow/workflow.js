import { Logger } from '@nestjs/common';
import { WorkflowNodeType, WorkflowResultType, } from './types';
export class CopilotWorkflow {
    constructor(prompt, provider, workflow) {
        this.prompt = prompt;
        this.provider = provider;
        this.logger = new Logger(CopilotWorkflow.name);
        const startNode = workflow.get('start');
        if (!startNode) {
            throw new Error(`No start node found in graph`);
        }
        this.rootNode = startNode;
    }
    async *runGraph(params, options) {
        let currentNode = this.rootNode;
        const lastParams = { ...params };
        while (currentNode) {
            let result = '';
            let nextNode;
            await currentNode.initNode(this.prompt, this.provider);
            for await (const ret of currentNode.next(lastParams, options)) {
                if (ret.type === WorkflowResultType.EndRun) {
                    nextNode = ret.nextNode;
                    break;
                }
                else if (ret.type === WorkflowResultType.Params) {
                    Object.assign(lastParams, ret.params);
                    if (currentNode.config.nodeType === WorkflowNodeType.Basic) {
                        const { type, promptName } = currentNode.config;
                        this.logger.verbose(`[${currentNode.name}][${type}][${promptName}]: update params - '${JSON.stringify(ret.params)}'`);
                    }
                }
                else if (ret.type === WorkflowResultType.Content) {
                    if (ret.passthrough) {
                        // pass through content as a stream response
                        yield ret.content;
                    }
                    else {
                        result += ret.content;
                    }
                }
            }
            if (currentNode.config.nodeType === WorkflowNodeType.Basic && result) {
                const { type, promptName } = currentNode.config;
                this.logger.verbose(`[${currentNode.name}][${type}][${promptName}]: update content - '${lastParams.content}' -> '${result}'`);
            }
            currentNode = nextNode;
            if (result)
                lastParams.content = result;
        }
    }
}
//# sourceMappingURL=workflow.js.map