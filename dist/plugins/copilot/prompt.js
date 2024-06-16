var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import Mustache from 'mustache';
import { getTokenEncoder, PromptMessageSchema, } from './types';
// disable escaping
Mustache.escape = (text) => text;
function extractMustacheParams(template) {
    const regex = /\{\{\s*([^{}]+)\s*\}\}/g;
    const params = [];
    let match;
    while ((match = regex.exec(template)) !== null) {
        params.push(match[1]);
    }
    return Array.from(new Set(params));
}
const EXCLUDE_MISSING_WARN_PARAMS = ['lora'];
export class ChatPrompt {
    static createFromPrompt(options) {
        return new ChatPrompt(options.name, options.action || undefined, options.model, options.messages);
    }
    constructor(name, action, model, messages) {
        this.name = name;
        this.action = action;
        this.model = model;
        this.messages = messages;
        this.logger = new Logger(ChatPrompt.name);
        this.templateParamKeys = [];
        this.templateParams = {};
        this.encoder = getTokenEncoder(model);
        this.promptTokenSize =
            this.encoder?.count(messages.map(m => m.content).join('') || '') || 0;
        this.templateParamKeys = extractMustacheParams(messages.map(m => m.content).join(''));
        this.templateParams = messages.reduce((acc, m) => Object.assign(acc, m.params), {});
    }
    /**
     * get prompt token size
     */
    get tokens() {
        return this.promptTokenSize;
    }
    /**
     * get prompt param keys in template
     */
    get paramKeys() {
        return this.templateParamKeys.slice();
    }
    /**
     * get prompt params
     */
    get params() {
        return { ...this.templateParams };
    }
    encode(message) {
        return this.encoder?.count(message) || 0;
    }
    checkParams(params, sessionId) {
        const selfParams = this.templateParams;
        for (const key of Object.keys(selfParams)) {
            const options = selfParams[key];
            const income = params[key];
            if (typeof income !== 'string' ||
                (Array.isArray(options) && !options.includes(income))) {
                if (sessionId && !EXCLUDE_MISSING_WARN_PARAMS.includes(key)) {
                    const prefix = income
                        ? `Invalid param value: ${key}=${income}`
                        : `Missing param value: ${key}`;
                    this.logger.warn(`${prefix} in session ${sessionId}, use default options: ${options[0]}`);
                }
                if (Array.isArray(options)) {
                    // use the first option if income is not in options
                    params[key] = options[0];
                }
                else {
                    params[key] = options;
                }
            }
        }
    }
    /**
     * render prompt messages with params
     * @param params record of params, e.g. { name: 'Alice' }
     * @returns e.g. [{ role: 'system', content: 'Hello, {{name}}' }] => [{ role: 'system', content: 'Hello, Alice' }]
     */
    finish(params, sessionId) {
        this.checkParams(params, sessionId);
        return this.messages.map(({ content, params: _, ...rest }) => ({
            ...rest,
            params,
            content: Mustache.render(content, params),
        }));
    }
}
let PromptService = class PromptService {
    constructor(db) {
        this.db = db;
        this.cache = new Map();
    }
    /**
     * list prompt names
     * @returns prompt names
     */
    async listNames() {
        return this.db.aiPrompt
            .findMany({ select: { name: true } })
            .then(prompts => Array.from(new Set(prompts.map(p => p.name))));
    }
    async list() {
        return this.db.aiPrompt.findMany({
            select: {
                name: true,
                action: true,
                model: true,
                messages: {
                    select: {
                        role: true,
                        content: true,
                        params: true,
                    },
                    orderBy: {
                        idx: 'asc',
                    },
                },
            },
        });
    }
    /**
     * get prompt messages by prompt name
     * @param name prompt name
     * @returns prompt messages
     */
    async get(name) {
        const cached = this.cache.get(name);
        if (cached)
            return cached;
        const prompt = await this.db.aiPrompt.findUnique({
            where: {
                name,
            },
            select: {
                name: true,
                action: true,
                model: true,
                messages: {
                    select: {
                        role: true,
                        content: true,
                        params: true,
                    },
                    orderBy: {
                        idx: 'asc',
                    },
                },
            },
        });
        const messages = PromptMessageSchema.array().safeParse(prompt?.messages);
        if (prompt && messages.success) {
            const chatPrompt = ChatPrompt.createFromPrompt({
                ...prompt,
                messages: messages.data,
            });
            this.cache.set(name, chatPrompt);
            return chatPrompt;
        }
        return null;
    }
    async set(name, model, messages) {
        return await this.db.aiPrompt
            .create({
            data: {
                name,
                model,
                messages: {
                    create: messages.map((m, idx) => ({
                        idx,
                        ...m,
                        attachments: m.attachments || undefined,
                        params: m.params || undefined,
                    })),
                },
            },
        })
            .then(ret => ret.id);
    }
    async update(name, messages) {
        const { id } = await this.db.aiPrompt.update({
            where: { name },
            data: {
                messages: {
                    // cleanup old messages
                    deleteMany: {},
                    create: messages.map((m, idx) => ({
                        idx,
                        ...m,
                        attachments: m.attachments || undefined,
                        params: m.params || undefined,
                    })),
                },
            },
        });
        this.cache.delete(name);
        return id;
    }
    async delete(name) {
        const { id } = await this.db.aiPrompt.delete({ where: { name } });
        this.cache.delete(name);
        return id;
    }
};
PromptService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaClient])
], PromptService);
export { PromptService };
//# sourceMappingURL=prompt.js.map