import { AiPromptRole } from '@prisma/client';
import { z } from 'zod';
import { fromModelName } from '../../native';
export var AvailableModels;
(function (AvailableModels) {
    // text to text
    AvailableModels["Gpt4Omni"] = "gpt-4o";
    AvailableModels["Gpt4VisionPreview"] = "gpt-4-vision-preview";
    AvailableModels["Gpt4TurboPreview"] = "gpt-4-turbo-preview";
    AvailableModels["Gpt35Turbo"] = "gpt-3.5-turbo";
    // embeddings
    AvailableModels["TextEmbedding3Large"] = "text-embedding-3-large";
    AvailableModels["TextEmbedding3Small"] = "text-embedding-3-small";
    AvailableModels["TextEmbeddingAda002"] = "text-embedding-ada-002";
    // moderation
    AvailableModels["TextModerationLatest"] = "text-moderation-latest";
    AvailableModels["TextModerationStable"] = "text-moderation-stable";
    // text to image
    AvailableModels["DallE3"] = "dall-e-3";
})(AvailableModels || (AvailableModels = {}));
export function getTokenEncoder(model) {
    if (!model)
        return null;
    const modelStr = AvailableModels[model];
    if (!modelStr)
        return null;
    if (modelStr.startsWith('gpt')) {
        return fromModelName(modelStr);
    }
    else if (modelStr.startsWith('dall')) {
        // dalle don't need to calc the token
        return null;
    }
    else {
        return fromModelName('gpt-4-turbo-preview');
    }
}
// ======== ChatMessage ========
export const ChatMessageRole = Object.values(AiPromptRole);
const PureMessageSchema = z.object({
    content: z.string(),
    attachments: z.array(z.string()).optional().nullable(),
    params: z
        .record(z.union([z.string(), z.array(z.string())]))
        .optional()
        .nullable(),
});
export const PromptMessageSchema = PureMessageSchema.extend({
    role: z.enum(ChatMessageRole),
}).strict();
export const ChatMessageSchema = PromptMessageSchema.extend({
    createdAt: z.date(),
}).strict();
export const SubmittedMessageSchema = PureMessageSchema.extend({
    sessionId: z.string(),
    content: z.string().optional(),
}).strict();
export const ChatHistorySchema = z
    .object({
    sessionId: z.string(),
    action: z.string().optional(),
    tokens: z.number(),
    messages: z.array(PromptMessageSchema.or(ChatMessageSchema)),
    createdAt: z.date(),
})
    .strict();
// ======== Provider Interface ========
export var CopilotProviderType;
(function (CopilotProviderType) {
    CopilotProviderType["FAL"] = "fal";
    CopilotProviderType["OpenAI"] = "openai";
    // only for test
    CopilotProviderType["Test"] = "test";
})(CopilotProviderType || (CopilotProviderType = {}));
export var CopilotCapability;
(function (CopilotCapability) {
    CopilotCapability["TextToText"] = "text-to-text";
    CopilotCapability["TextToEmbedding"] = "text-to-embedding";
    CopilotCapability["TextToImage"] = "text-to-image";
    CopilotCapability["ImageToImage"] = "image-to-image";
    CopilotCapability["ImageToText"] = "image-to-text";
})(CopilotCapability || (CopilotCapability = {}));
const CopilotProviderOptionsSchema = z.object({
    signal: z.instanceof(AbortSignal).optional(),
    user: z.string().optional(),
});
const CopilotChatOptionsSchema = CopilotProviderOptionsSchema.extend({
    temperature: z.number().optional(),
    maxTokens: z.number().optional(),
}).optional();
const CopilotEmbeddingOptionsSchema = CopilotProviderOptionsSchema.extend({
    dimensions: z.number(),
}).optional();
const CopilotImageOptionsSchema = CopilotProviderOptionsSchema.extend({
    seed: z.number().optional(),
}).optional();
//# sourceMappingURL=types.js.map