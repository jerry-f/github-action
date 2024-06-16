import { ClientOptions, OpenAI } from 'openai';
import { CopilotCapability, CopilotChatOptions, CopilotEmbeddingOptions, CopilotImageOptions, CopilotImageToTextProvider, CopilotProviderType, CopilotTextToEmbeddingProvider, CopilotTextToImageProvider, CopilotTextToTextProvider, PromptMessage } from '../types';
export declare const DEFAULT_DIMENSIONS = 256;
export declare class OpenAIProvider implements CopilotTextToTextProvider, CopilotTextToEmbeddingProvider, CopilotTextToImageProvider, CopilotImageToTextProvider {
    static readonly type = CopilotProviderType.OpenAI;
    static readonly capabilities: CopilotCapability[];
    readonly availableModels: string[];
    private readonly logger;
    private readonly instance;
    private existsModels;
    constructor(config: ClientOptions);
    static assetsConfig(config: ClientOptions): boolean;
    get type(): CopilotProviderType;
    getCapabilities(): CopilotCapability[];
    isModelAvailable(model: string): Promise<boolean>;
    protected chatToGPTMessage(messages: PromptMessage[]): OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    protected checkParams({ messages, embeddings, model, }: {
        messages?: PromptMessage[];
        embeddings?: string[];
        model: string;
    }): void;
    generateText(messages: PromptMessage[], model?: string, options?: CopilotChatOptions): Promise<string>;
    generateTextStream(messages: PromptMessage[], model?: string, options?: CopilotChatOptions): AsyncIterable<string>;
    generateEmbedding(messages: string | string[], model: string, options?: CopilotEmbeddingOptions): Promise<number[][]>;
    generateImages(messages: PromptMessage[], model?: string, options?: CopilotImageOptions): Promise<Array<string>>;
    generateImagesStream(messages: PromptMessage[], model?: string, options?: CopilotImageOptions): AsyncIterable<string>;
}
//# sourceMappingURL=openai.d.ts.map