import { type Tokenizer } from '@affine/server-native';
import { z } from 'zod';
import type { ChatPrompt } from './prompt';
export declare enum AvailableModels {
    Gpt4Omni = "gpt-4o",
    Gpt4VisionPreview = "gpt-4-vision-preview",
    Gpt4TurboPreview = "gpt-4-turbo-preview",
    Gpt35Turbo = "gpt-3.5-turbo",
    TextEmbedding3Large = "text-embedding-3-large",
    TextEmbedding3Small = "text-embedding-3-small",
    TextEmbeddingAda002 = "text-embedding-ada-002",
    TextModerationLatest = "text-moderation-latest",
    TextModerationStable = "text-moderation-stable",
    DallE3 = "dall-e-3"
}
export type AvailableModel = keyof typeof AvailableModels;
export declare function getTokenEncoder(model?: string | null): Tokenizer | null;
export declare const ChatMessageRole: ["system", "assistant", "user"];
export declare const PromptMessageSchema: z.ZodObject<z.objectUtil.extendShape<{
    content: z.ZodString;
    attachments: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    params: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>>>;
}, {
    role: z.ZodEnum<["system", "assistant", "user"]>;
}>, "strict", z.ZodTypeAny, {
    content: string;
    role: "user" | "system" | "assistant";
    attachments?: string[] | null | undefined;
    params?: Record<string, string | string[]> | null | undefined;
}, {
    content: string;
    role: "user" | "system" | "assistant";
    attachments?: string[] | null | undefined;
    params?: Record<string, string | string[]> | null | undefined;
}>;
export type PromptMessage = z.infer<typeof PromptMessageSchema>;
export type PromptParams = NonNullable<PromptMessage['params']>;
export declare const ChatMessageSchema: z.ZodObject<z.objectUtil.extendShape<z.objectUtil.extendShape<{
    content: z.ZodString;
    attachments: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    params: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>>>;
}, {
    role: z.ZodEnum<["system", "assistant", "user"]>;
}>, {
    createdAt: z.ZodDate;
}>, "strict", z.ZodTypeAny, {
    content: string;
    role: "user" | "system" | "assistant";
    createdAt: Date;
    attachments?: string[] | null | undefined;
    params?: Record<string, string | string[]> | null | undefined;
}, {
    content: string;
    role: "user" | "system" | "assistant";
    createdAt: Date;
    attachments?: string[] | null | undefined;
    params?: Record<string, string | string[]> | null | undefined;
}>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export declare const SubmittedMessageSchema: z.ZodObject<z.objectUtil.extendShape<{
    content: z.ZodString;
    attachments: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    params: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>>>;
}, {
    sessionId: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
}>, "strict", z.ZodTypeAny, {
    sessionId: string;
    attachments?: string[] | null | undefined;
    content?: string | undefined;
    params?: Record<string, string | string[]> | null | undefined;
}, {
    sessionId: string;
    attachments?: string[] | null | undefined;
    content?: string | undefined;
    params?: Record<string, string | string[]> | null | undefined;
}>;
export type SubmittedMessage = z.infer<typeof SubmittedMessageSchema>;
export declare const ChatHistorySchema: z.ZodObject<{
    sessionId: z.ZodString;
    action: z.ZodOptional<z.ZodString>;
    tokens: z.ZodNumber;
    messages: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
        content: z.ZodString;
        attachments: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        params: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>>>;
    }, {
        role: z.ZodEnum<["system", "assistant", "user"]>;
    }>, "strict", z.ZodTypeAny, {
        content: string;
        role: "user" | "system" | "assistant";
        attachments?: string[] | null | undefined;
        params?: Record<string, string | string[]> | null | undefined;
    }, {
        content: string;
        role: "user" | "system" | "assistant";
        attachments?: string[] | null | undefined;
        params?: Record<string, string | string[]> | null | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<z.objectUtil.extendShape<{
        content: z.ZodString;
        attachments: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        params: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>>>;
    }, {
        role: z.ZodEnum<["system", "assistant", "user"]>;
    }>, {
        createdAt: z.ZodDate;
    }>, "strict", z.ZodTypeAny, {
        content: string;
        role: "user" | "system" | "assistant";
        createdAt: Date;
        attachments?: string[] | null | undefined;
        params?: Record<string, string | string[]> | null | undefined;
    }, {
        content: string;
        role: "user" | "system" | "assistant";
        createdAt: Date;
        attachments?: string[] | null | undefined;
        params?: Record<string, string | string[]> | null | undefined;
    }>]>, "many">;
    createdAt: z.ZodDate;
}, "strict", z.ZodTypeAny, {
    createdAt: Date;
    sessionId: string;
    messages: ({
        content: string;
        role: "user" | "system" | "assistant";
        attachments?: string[] | null | undefined;
        params?: Record<string, string | string[]> | null | undefined;
    } | {
        content: string;
        role: "user" | "system" | "assistant";
        createdAt: Date;
        attachments?: string[] | null | undefined;
        params?: Record<string, string | string[]> | null | undefined;
    })[];
    tokens: number;
    action?: string | undefined;
}, {
    createdAt: Date;
    sessionId: string;
    messages: ({
        content: string;
        role: "user" | "system" | "assistant";
        attachments?: string[] | null | undefined;
        params?: Record<string, string | string[]> | null | undefined;
    } | {
        content: string;
        role: "user" | "system" | "assistant";
        createdAt: Date;
        attachments?: string[] | null | undefined;
        params?: Record<string, string | string[]> | null | undefined;
    })[];
    tokens: number;
    action?: string | undefined;
}>;
export type ChatHistory = z.infer<typeof ChatHistorySchema>;
export interface ChatSessionOptions {
    userId: string;
    workspaceId: string;
    docId: string;
    promptName: string;
}
export interface ChatSessionState extends Omit<ChatSessionOptions, 'promptName'> {
    sessionId: string;
    prompt: ChatPrompt;
    messages: ChatMessage[];
}
export type ListHistoriesOptions = {
    action: boolean | undefined;
    limit: number | undefined;
    skip: number | undefined;
    sessionId: string | undefined;
};
export declare enum CopilotProviderType {
    FAL = "fal",
    OpenAI = "openai",
    Test = "test"
}
export declare enum CopilotCapability {
    TextToText = "text-to-text",
    TextToEmbedding = "text-to-embedding",
    TextToImage = "text-to-image",
    ImageToImage = "image-to-image",
    ImageToText = "image-to-text"
}
declare const CopilotChatOptionsSchema: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
    signal: z.ZodOptional<z.ZodType<AbortSignal, z.ZodTypeDef, AbortSignal>>;
    user: z.ZodOptional<z.ZodString>;
}, {
    temperature: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
}>, "strip", z.ZodTypeAny, {
    maxTokens?: number | undefined;
    user?: string | undefined;
    signal?: AbortSignal | undefined;
    temperature?: number | undefined;
}, {
    maxTokens?: number | undefined;
    user?: string | undefined;
    signal?: AbortSignal | undefined;
    temperature?: number | undefined;
}>>;
export type CopilotChatOptions = z.infer<typeof CopilotChatOptionsSchema>;
declare const CopilotEmbeddingOptionsSchema: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
    signal: z.ZodOptional<z.ZodType<AbortSignal, z.ZodTypeDef, AbortSignal>>;
    user: z.ZodOptional<z.ZodString>;
}, {
    dimensions: z.ZodNumber;
}>, "strip", z.ZodTypeAny, {
    dimensions: number;
    user?: string | undefined;
    signal?: AbortSignal | undefined;
}, {
    dimensions: number;
    user?: string | undefined;
    signal?: AbortSignal | undefined;
}>>;
export type CopilotEmbeddingOptions = z.infer<typeof CopilotEmbeddingOptionsSchema>;
declare const CopilotImageOptionsSchema: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
    signal: z.ZodOptional<z.ZodType<AbortSignal, z.ZodTypeDef, AbortSignal>>;
    user: z.ZodOptional<z.ZodString>;
}, {
    seed: z.ZodOptional<z.ZodNumber>;
}>, "strip", z.ZodTypeAny, {
    user?: string | undefined;
    signal?: AbortSignal | undefined;
    seed?: number | undefined;
}, {
    user?: string | undefined;
    signal?: AbortSignal | undefined;
    seed?: number | undefined;
}>>;
export type CopilotImageOptions = z.infer<typeof CopilotImageOptionsSchema>;
export interface CopilotProvider {
    readonly type: CopilotProviderType;
    getCapabilities(): CopilotCapability[];
    isModelAvailable(model: string): Promise<boolean>;
}
export interface CopilotTextToTextProvider extends CopilotProvider {
    generateText(messages: PromptMessage[], model?: string, options?: CopilotChatOptions): Promise<string>;
    generateTextStream(messages: PromptMessage[], model?: string, options?: CopilotChatOptions): AsyncIterable<string>;
}
export interface CopilotTextToEmbeddingProvider extends CopilotProvider {
    generateEmbedding(messages: string[] | string, model: string, options?: CopilotEmbeddingOptions): Promise<number[][]>;
}
export interface CopilotTextToImageProvider extends CopilotProvider {
    generateImages(messages: PromptMessage[], model: string, options?: CopilotImageOptions): Promise<Array<string>>;
    generateImagesStream(messages: PromptMessage[], model?: string, options?: CopilotImageOptions): AsyncIterable<string>;
}
export interface CopilotImageToTextProvider extends CopilotProvider {
    generateText(messages: PromptMessage[], model: string, options?: CopilotChatOptions): Promise<string>;
    generateTextStream(messages: PromptMessage[], model: string, options?: CopilotChatOptions): AsyncIterable<string>;
}
export interface CopilotImageToImageProvider extends CopilotProvider {
    generateImages(messages: PromptMessage[], model: string, options?: CopilotImageOptions): Promise<Array<string>>;
    generateImagesStream(messages: PromptMessage[], model?: string, options?: CopilotImageOptions): AsyncIterable<string>;
}
export type CapabilityToCopilotProvider = {
    [CopilotCapability.TextToText]: CopilotTextToTextProvider;
    [CopilotCapability.TextToEmbedding]: CopilotTextToEmbeddingProvider;
    [CopilotCapability.TextToImage]: CopilotTextToImageProvider;
    [CopilotCapability.ImageToText]: CopilotImageToTextProvider;
    [CopilotCapability.ImageToImage]: CopilotImageToImageProvider;
};
export type CopilotTextProvider = CopilotTextToTextProvider | CopilotImageToTextProvider;
export type CopilotImageProvider = CopilotTextToImageProvider | CopilotImageToImageProvider;
export type CopilotAllProvider = CopilotTextProvider | CopilotImageProvider | CopilotTextToEmbeddingProvider;
export {};
//# sourceMappingURL=types.d.ts.map