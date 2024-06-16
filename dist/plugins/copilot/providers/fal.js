import assert from 'node:assert';
import { config as falConfig, stream as falStream, } from '@fal-ai/serverless-client';
import { Logger } from '@nestjs/common';
import { z } from 'zod';
import { CopilotCapability, CopilotProviderType, } from '../types';
const FalImageSchema = z
    .object({
    url: z.string(),
    seed: z.number().optional(),
    content_type: z.string(),
    file_name: z.string().optional(),
    file_size: z.number().optional(),
    width: z.number(),
    height: z.number(),
})
    .optional();
const FalResponseSchema = z.object({
    detail: z
        .union([z.array(z.object({ msg: z.string() })), z.string()])
        .optional(),
    images: z.array(FalImageSchema).optional(),
    image: FalImageSchema.optional(),
    output: z.string().optional(),
});
const FalStreamOutputSchema = z.object({
    type: z.literal('output'),
    output: FalResponseSchema,
});
export class FalProvider {
    static { this.type = CopilotProviderType.FAL; }
    static { this.capabilities = [
        CopilotCapability.TextToImage,
        CopilotCapability.ImageToImage,
        CopilotCapability.ImageToText,
    ]; }
    constructor(config) {
        this.config = config;
        this.availableModels = [
            // text to image
            'fast-turbo-diffusion',
            // image to image
            'lcm-sd15-i2i',
            'clarity-upscaler',
            'face-to-sticker',
            'imageutils/rembg',
            'fast-sdxl/image-to-image',
            'workflows/darkskygit/animie',
            'workflows/darkskygit/clay',
            'workflows/darkskygit/pixel-art',
            'workflows/darkskygit/sketch',
            // image to text
            'llava-next',
        ];
        this.logger = new Logger(FalProvider.name);
        assert(FalProvider.assetsConfig(config));
        falConfig({ credentials: this.config.apiKey });
    }
    static assetsConfig(config) {
        return !!config.apiKey;
    }
    get type() {
        return FalProvider.type;
    }
    getCapabilities() {
        return FalProvider.capabilities;
    }
    async isModelAvailable(model) {
        return this.availableModels.includes(model);
    }
    extractError(resp) {
        return Array.isArray(resp.detail)
            ? resp.detail[0]?.msg
            : typeof resp.detail === 'string'
                ? resp.detail
                : '';
    }
    extractPrompt(message) {
        if (!message)
            throw new Error('Prompt is empty');
        const { content, attachments, params } = message;
        // prompt attachments require at least one
        if (!content && (!Array.isArray(attachments) || !attachments.length)) {
            throw new Error('Prompt or Attachments is empty');
        }
        if (Array.isArray(attachments) && attachments.length > 1) {
            throw new Error('Only one attachment is allowed');
        }
        const lora = (params?.lora
            ? Array.isArray(params.lora)
                ? params.lora
                : [params.lora]
            : []).filter(v => typeof v === 'string' && v.length);
        return {
            image_url: attachments?.[0],
            prompt: content.trim(),
            lora: lora.length ? lora : undefined,
        };
    }
    async generateText(messages, model = 'llava-next', options = {}) {
        if (!this.availableModels.includes(model)) {
            throw new Error(`Invalid model: ${model}`);
        }
        // by default, image prompt assumes there is only one message
        const prompt = this.extractPrompt(messages.pop());
        const data = (await fetch(`https://fal.run/fal-ai/${model}`, {
            method: 'POST',
            headers: {
                Authorization: `key ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...prompt,
                sync_mode: true,
                enable_safety_checks: false,
            }),
            signal: options.signal,
        }).then(res => res.json()));
        if (!data.output) {
            const error = this.extractError(data);
            throw new Error(error ? `Failed to generate image: ${error}` : 'No images generated');
        }
        return data.output;
    }
    async *generateTextStream(messages, model = 'llava-next', options = {}) {
        const result = await this.generateText(messages, model, options);
        for await (const content of result) {
            if (content) {
                yield content;
                if (options.signal?.aborted) {
                    break;
                }
            }
        }
    }
    async buildResponse(messages, model = this.availableModels[0], options = {}) {
        // by default, image prompt assumes there is only one message
        const prompt = this.extractPrompt(messages.pop());
        if (model.startsWith('workflows/')) {
            const stream = await falStream(model, { input: prompt });
            const result = FalStreamOutputSchema.safeParse(await stream.done());
            if (result.success)
                return result.data.output;
            const errors = JSON.stringify(result.error.errors);
            throw new Error(`Unexpected fal response: ${errors}`);
        }
        else {
            const response = await fetch(`https://fal.run/fal-ai/${model}`, {
                method: 'POST',
                headers: {
                    Authorization: `key ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...prompt,
                    sync_mode: true,
                    seed: options.seed || 42,
                    enable_safety_checks: false,
                }),
                signal: options.signal,
            });
            const result = FalResponseSchema.safeParse(await response.json());
            if (result.success)
                return result.data;
            const errors = JSON.stringify(result.error.errors);
            throw new Error(`Unexpected fal response: ${errors}`);
        }
    }
    // ====== image to image ======
    async generateImages(messages, model = this.availableModels[0], options = {}) {
        if (!this.availableModels.includes(model)) {
            throw new Error(`Invalid model: ${model}`);
        }
        try {
            const data = await this.buildResponse(messages, model, options);
            if (!data.images?.length && !data.image?.url) {
                const error = this.extractError(data);
                const finalError = error
                    ? `Failed to generate image: ${error}`
                    : 'No images generated';
                this.logger.error(finalError);
                throw new Error(finalError);
            }
            if (data.image?.url) {
                return [data.image.url];
            }
            return (data.images
                ?.filter((image) => !!image)
                .map(image => image.url) || []);
        }
        catch (e) {
            const error = `Failed to generate image: ${e.message}`;
            this.logger.error(error, e.stack);
            throw new Error(error);
        }
    }
    async *generateImagesStream(messages, model = this.availableModels[0], options = {}) {
        const ret = await this.generateImages(messages, model, options);
        for (const url of ret) {
            yield url;
        }
    }
}
//# sourceMappingURL=fal.js.map