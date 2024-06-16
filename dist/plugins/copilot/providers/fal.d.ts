import { CopilotCapability, CopilotChatOptions, CopilotImageOptions, CopilotImageToImageProvider, CopilotProviderType, CopilotTextToImageProvider, PromptMessage } from '../types';
export type FalConfig = {
    apiKey: string;
};
export declare class FalProvider implements CopilotTextToImageProvider, CopilotImageToImageProvider {
    private readonly config;
    static readonly type = CopilotProviderType.FAL;
    static readonly capabilities: CopilotCapability[];
    readonly availableModels: string[];
    private readonly logger;
    constructor(config: FalConfig);
    static assetsConfig(config: FalConfig): boolean;
    get type(): CopilotProviderType;
    getCapabilities(): CopilotCapability[];
    isModelAvailable(model: string): Promise<boolean>;
    private extractError;
    private extractPrompt;
    generateText(messages: PromptMessage[], model?: string, options?: CopilotChatOptions): Promise<string>;
    generateTextStream(messages: PromptMessage[], model?: string, options?: CopilotChatOptions): AsyncIterable<string>;
    private buildResponse;
    generateImages(messages: PromptMessage[], model?: string, options?: CopilotImageOptions): Promise<Array<string>>;
    generateImagesStream(messages: PromptMessage[], model?: string, options?: CopilotImageOptions): AsyncIterable<string>;
}
//# sourceMappingURL=fal.d.ts.map