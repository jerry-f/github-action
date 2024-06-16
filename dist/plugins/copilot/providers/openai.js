import { Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatMessageRole, CopilotCapability, CopilotProviderType, } from '../types';
export const DEFAULT_DIMENSIONS = 256;
const SIMPLE_IMAGE_URL_REGEX = /^(https?:\/\/|data:image\/)/;
export class OpenAIProvider {
    static { this.type = CopilotProviderType.OpenAI; }
    static { this.capabilities = [
        CopilotCapability.TextToText,
        CopilotCapability.TextToEmbedding,
        CopilotCapability.TextToImage,
        CopilotCapability.ImageToText,
    ]; }
    constructor(config) {
        this.availableModels = [
            // text to text
            'gpt-4o',
            'gpt-4-vision-preview',
            'gpt-4-turbo-preview',
            'gpt-3.5-turbo',
            // embeddings
            'text-embedding-3-large',
            'text-embedding-3-small',
            'text-embedding-ada-002',
            // moderation
            'text-moderation-latest',
            'text-moderation-stable',
            // text to image
            'dall-e-3',
        ];
        this.logger = new Logger(OpenAIProvider.type);
        this.instance = new OpenAI(config);
    }
    static assetsConfig(config) {
        return !!config?.apiKey;
    }
    get type() {
        return OpenAIProvider.type;
    }
    getCapabilities() {
        return OpenAIProvider.capabilities;
    }
    async isModelAvailable(model) {
        const knownModels = this.availableModels.includes(model);
        if (knownModels)
            return true;
        if (!this.existsModels) {
            try {
                this.existsModels = await this.instance.models
                    .list()
                    .then(({ data }) => data.map(m => m.id));
            }
            catch (e) {
                this.logger.error('Failed to fetch online model list', e);
            }
        }
        return !!this.existsModels?.includes(model);
    }
    chatToGPTMessage(messages) {
        // filter redundant fields
        return messages.map(({ role, content, attachments }) => {
            content = content.trim();
            if (Array.isArray(attachments)) {
                const contents = [];
                if (content.length) {
                    contents.push({
                        type: 'text',
                        text: content,
                    });
                }
                contents.push(...attachments
                    .filter(url => SIMPLE_IMAGE_URL_REGEX.test(url))
                    .map(url => ({
                    type: 'image_url',
                    image_url: { url, detail: 'high' },
                })));
                return {
                    role,
                    content: contents,
                };
            }
            else {
                return { role, content };
            }
        });
    }
    checkParams({ messages, embeddings, model, }) {
        if (!this.availableModels.includes(model)) {
            throw new Error(`Invalid model: ${model}`);
        }
        if (Array.isArray(messages) && messages.length > 0) {
            if (messages.some(m => 
            // check non-object
            typeof m !== 'object' ||
                !m ||
                // check content
                typeof m.content !== 'string' ||
                // content and attachments must exist at least one
                ((!m.content || !m.content.trim()) &&
                    (!Array.isArray(m.attachments) || !m.attachments.length)))) {
                throw new Error('Empty message content');
            }
            if (messages.some(m => typeof m.role !== 'string' ||
                !m.role ||
                !ChatMessageRole.includes(m.role))) {
                throw new Error('Invalid message role');
            }
        }
        else if (Array.isArray(embeddings) &&
            embeddings.some(e => typeof e !== 'string' || !e || !e.trim())) {
            throw new Error('Invalid embedding');
        }
    }
    // ====== text to text ======
    async generateText(messages, model = 'gpt-3.5-turbo', options = {}) {
        this.checkParams({ messages, model });
        const result = await this.instance.chat.completions.create({
            messages: this.chatToGPTMessage(messages),
            model: model,
            temperature: options.temperature || 0,
            max_tokens: options.maxTokens || 4096,
            user: options.user,
        }, { signal: options.signal });
        const { content } = result.choices[0].message;
        if (!content) {
            throw new Error('Failed to generate text');
        }
        return content;
    }
    async *generateTextStream(messages, model = 'gpt-3.5-turbo', options = {}) {
        this.checkParams({ messages, model });
        const result = await this.instance.chat.completions.create({
            stream: true,
            messages: this.chatToGPTMessage(messages),
            model: model,
            temperature: options.temperature || 0,
            max_tokens: options.maxTokens || 4096,
            user: options.user,
        }, {
            signal: options.signal,
        });
        for await (const message of result) {
            const content = message.choices[0].delta.content;
            if (content) {
                yield content;
                if (options.signal?.aborted) {
                    result.controller.abort();
                    break;
                }
            }
        }
    }
    // ====== text to embedding ======
    async generateEmbedding(messages, model, options = { dimensions: DEFAULT_DIMENSIONS }) {
        messages = Array.isArray(messages) ? messages : [messages];
        this.checkParams({ embeddings: messages, model });
        const result = await this.instance.embeddings.create({
            model: model,
            input: messages,
            dimensions: options.dimensions || DEFAULT_DIMENSIONS,
            user: options.user,
        });
        return result.data.map(e => e.embedding);
    }
    // ====== text to image ======
    async generateImages(messages, model = 'dall-e-3', options = {}) {
        const { content: prompt } = messages.pop() || {};
        if (!prompt) {
            throw new Error('Prompt is required');
        }
        const result = await this.instance.images.generate({
            prompt,
            model,
            response_format: 'url',
            user: options.user,
        }, { signal: options.signal });
        return result.data.map(image => image.url).filter((v) => !!v);
    }
    async *generateImagesStream(messages, model = 'dall-e-3', options = {}) {
        const ret = await this.generateImages(messages, model, options);
        for (const url of ret) {
            yield url;
        }
    }
}
//# sourceMappingURL=openai.js.map