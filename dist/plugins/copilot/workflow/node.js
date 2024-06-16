import { WorkflowNodeType, WorkflowResultType, } from './types';
export class WorkflowNode {
    constructor(data) {
        this.data = data;
        this.edges = [];
        this.parents = [];
        this.prompt = null;
        this.provider = null;
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return this.data.name;
    }
    get config() {
        return Object.assign({}, this.data);
    }
    get parent() {
        return this.parents;
    }
    set parent(node) {
        if (!this.parents.includes(node)) {
            this.parents.push(node);
        }
    }
    addEdge(node) {
        if (this.data.nodeType === WorkflowNodeType.Basic) {
            if (this.edges.length > 0) {
                throw new Error(`Basic block can only have one edge`);
            }
        }
        else if (!this.data.condition) {
            throw new Error(`Decision block must have a condition`);
        }
        node.parent = this;
        this.edges.push(node);
        return this.edges.length;
    }
    async initNode(prompt, provider) {
        if (this.prompt && this.provider)
            return;
        if (this.data.nodeType === WorkflowNodeType.Basic) {
            this.prompt = await prompt.get(this.data.promptName);
            if (!this.prompt) {
                throw new Error(`Prompt ${this.data.promptName} not found when running workflow node ${this.name}`);
            }
            this.provider = await provider.getProviderByModel(this.prompt.model);
            if (!this.provider) {
                throw new Error(`Provider not found for model ${this.prompt.model} when running workflow node ${this.name}`);
            }
        }
    }
    async evaluateCondition(_condition) {
        // todo: evaluate condition to impl decision block
        return this.edges[0]?.id;
    }
    getStreamProvider() {
        if (this.data.nodeType === WorkflowNodeType.Basic && this.provider) {
            if (this.data.type === 'text' &&
                'generateText' in this.provider &&
                !this.data.paramKey) {
                return this.provider.generateTextStream.bind(this.provider);
            }
            else if (this.data.type === 'image' &&
                'generateImages' in this.provider &&
                !this.data.paramKey) {
                return this.provider.generateImagesStream.bind(this.provider);
            }
        }
        throw new Error(`Stream Provider not found for node ${this.name}`);
    }
    getProvider() {
        if (this.data.nodeType === WorkflowNodeType.Basic && this.provider) {
            if (this.data.type === 'text' &&
                'generateText' in this.provider &&
                this.data.paramKey) {
                return this.provider.generateText.bind(this.provider);
            }
            else if (this.data.type === 'image' &&
                'generateImages' in this.provider &&
                this.data.paramKey) {
                return this.provider.generateImages.bind(this.provider);
            }
        }
        throw new Error(`Provider not found for node ${this.name}`);
    }
    async *next(params, options) {
        if (!this.prompt || !this.provider) {
            throw new Error(`Node ${this.name} not initialized`);
        }
        yield { type: WorkflowResultType.StartRun, nodeId: this.id };
        // choose next node in graph
        let nextNode = this.edges[0];
        if (this.data.nodeType === WorkflowNodeType.Decision) {
            const nextNodeId = await this.evaluateCondition(this.data.condition);
            // return empty to choose default edge
            if (nextNodeId) {
                nextNode = this.edges.find(node => node.id === nextNodeId);
                if (!nextNode) {
                    throw new Error(`No edge found for condition ${this.data.condition}`);
                }
            }
        }
        else {
            const finalMessage = this.prompt.finish(params);
            if (this.data.paramKey) {
                const provider = this.getProvider();
                // update params with custom key
                yield {
                    type: WorkflowResultType.Params,
                    params: {
                        [this.data.paramKey]: await provider(finalMessage, this.prompt.model, options),
                    },
                };
            }
            else {
                const provider = this.getStreamProvider();
                for await (const content of provider(finalMessage, this.prompt.model, options)) {
                    yield {
                        type: WorkflowResultType.Content,
                        nodeId: this.id,
                        content,
                        // pass through content as a stream response if no next node
                        passthrough: !nextNode,
                    };
                }
            }
        }
        yield { type: WorkflowResultType.EndRun, nextNode };
    }
}
//# sourceMappingURL=node.js.map