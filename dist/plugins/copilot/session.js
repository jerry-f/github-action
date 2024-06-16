var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChatSessionService_1;
import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { AiPromptRole, PrismaClient } from '@prisma/client';
import { FeatureManagementService } from '../../core/features';
import { QuotaService } from '../../core/quota';
import { PaymentRequiredException } from '../../fundamentals';
import { ChatMessageCache } from './message';
import { PromptService } from './prompt';
import { ChatMessageSchema, getTokenEncoder, } from './types';
export class ChatSession {
    constructor(messageCache, state, dispose, maxTokenSize = 3840) {
        this.messageCache = messageCache;
        this.state = state;
        this.dispose = dispose;
        this.maxTokenSize = maxTokenSize;
        this.stashMessageCount = 0;
    }
    get model() {
        return this.state.prompt.model;
    }
    get config() {
        const { sessionId, userId, workspaceId, docId, prompt: { name: promptName }, } = this.state;
        return { sessionId, userId, workspaceId, docId, promptName };
    }
    get stashMessages() {
        if (!this.stashMessageCount)
            return [];
        return this.state.messages.slice(-this.stashMessageCount);
    }
    push(message) {
        if (this.state.prompt.action &&
            this.state.messages.length > 0 &&
            message.role === 'user') {
            throw new Error('Action has been taken, no more messages allowed');
        }
        this.state.messages.push(message);
        this.stashMessageCount += 1;
    }
    revertLatestMessage() {
        const messages = this.state.messages;
        messages.splice(messages.findLastIndex(({ role }) => role === AiPromptRole.user) + 1);
    }
    async getMessageById(messageId) {
        const message = await this.messageCache.get(messageId);
        if (!message || message.sessionId !== this.state.sessionId) {
            throw new Error(`Message not found: ${messageId}`);
        }
        return message;
    }
    async pushByMessageId(messageId) {
        const message = await this.messageCache.get(messageId);
        if (!message || message.sessionId !== this.state.sessionId) {
            throw new Error(`Message not found: ${messageId}`);
        }
        this.push({
            role: 'user',
            content: message.content || '',
            attachments: message.attachments,
            params: message.params,
            createdAt: new Date(),
        });
    }
    pop() {
        return this.state.messages.pop();
    }
    takeMessages() {
        if (this.state.prompt.action) {
            const messages = this.state.messages;
            return messages.slice(messages.length - 1);
        }
        const ret = [];
        const messages = this.state.messages.slice();
        let size = this.state.prompt.tokens;
        while (messages.length) {
            const message = messages.pop();
            if (!message)
                break;
            size += this.state.prompt.encode(message.content);
            if (size > this.maxTokenSize) {
                break;
            }
            ret.push(message);
        }
        ret.reverse();
        return ret;
    }
    finish(params) {
        const messages = this.takeMessages();
        const firstMessage = messages.at(0);
        // if the message in prompt config contains {{content}},
        // we should combine it with the user message in the prompt
        if (messages.length === 1 &&
            firstMessage &&
            this.state.prompt.paramKeys.includes('content')) {
            const normalizedParams = {
                ...params,
                ...firstMessage.params,
                content: firstMessage.content,
            };
            const finished = this.state.prompt.finish(normalizedParams, this.config.sessionId);
            finished[0].attachments = firstMessage.attachments;
            return finished;
        }
        return [
            ...this.state.prompt.finish(Object.keys(params).length ? params : firstMessage?.params || {}, this.config.sessionId),
            ...messages.filter(m => m.content?.trim() || m.attachments?.length),
        ];
    }
    async save() {
        await this.dispose?.({
            ...this.state,
            // only provide new messages
            messages: this.stashMessages,
        });
        this.stashMessageCount = 0;
    }
    async [Symbol.asyncDispose]() {
        await this.save?.();
    }
}
let ChatSessionService = ChatSessionService_1 = class ChatSessionService {
    constructor(db, feature, quota, messageCache, prompt) {
        this.db = db;
        this.feature = feature;
        this.quota = quota;
        this.messageCache = messageCache;
        this.prompt = prompt;
        this.logger = new Logger(ChatSessionService_1.name);
    }
    async setSession(state) {
        return await this.db.$transaction(async (tx) => {
            let sessionId = state.sessionId;
            // find existing session if session is chat session
            if (!state.prompt.action) {
                const { id, deletedAt } = (await tx.aiSession.findFirst({
                    where: {
                        userId: state.userId,
                        workspaceId: state.workspaceId,
                        docId: state.docId,
                        prompt: { action: { equals: null } },
                    },
                    select: { id: true, deletedAt: true },
                })) || {};
                if (deletedAt)
                    throw new Error(`Session is deleted: ${id}`);
                if (id)
                    sessionId = id;
            }
            const haveSession = await tx.aiSession
                .count({
                where: {
                    id: sessionId,
                    userId: state.userId,
                },
            })
                .then(c => c > 0);
            if (haveSession) {
                // message will only exists when setSession call by session.save
                if (state.messages.length) {
                    await tx.aiSessionMessage.createMany({
                        data: state.messages.map(m => ({
                            ...m,
                            attachments: m.attachments || undefined,
                            params: m.params || undefined,
                            sessionId,
                        })),
                    });
                    // only count message generated by user
                    const userMessages = state.messages.filter(m => m.role === 'user');
                    await tx.aiSession.update({
                        where: { id: sessionId },
                        data: {
                            messageCost: { increment: userMessages.length },
                            tokenCost: {
                                increment: this.calculateTokenSize(userMessages, state.prompt.model),
                            },
                        },
                    });
                }
            }
            else {
                await tx.aiSession.create({
                    data: {
                        id: sessionId,
                        workspaceId: state.workspaceId,
                        docId: state.docId,
                        // connect
                        userId: state.userId,
                        promptName: state.prompt.name,
                    },
                });
            }
            return sessionId;
        });
    }
    async getSession(sessionId) {
        return await this.db.aiSession
            .findUnique({
            where: { id: sessionId, deletedAt: null },
            select: {
                id: true,
                userId: true,
                workspaceId: true,
                docId: true,
                messages: {
                    select: { role: true, content: true, createdAt: true },
                    orderBy: { createdAt: 'asc' },
                },
                promptName: true,
            },
        })
            .then(async (session) => {
            if (!session)
                return;
            const prompt = await this.prompt.get(session.promptName);
            if (!prompt)
                throw new Error(`Prompt not found: ${session.promptName}`);
            const messages = ChatMessageSchema.array().safeParse(session.messages);
            return {
                sessionId: session.id,
                userId: session.userId,
                workspaceId: session.workspaceId,
                docId: session.docId,
                prompt,
                messages: messages.success ? messages.data : [],
            };
        });
    }
    // revert the latest messages not generate by user
    // after revert, we can retry the action
    async revertLatestMessage(sessionId) {
        await this.db.$transaction(async (tx) => {
            const id = await tx.aiSession
                .findUnique({
                where: { id: sessionId, deletedAt: null },
                select: { id: true },
            })
                .then(session => session?.id);
            if (!id) {
                throw new Error(`Session not found: ${sessionId}`);
            }
            const ids = await tx.aiSessionMessage
                .findMany({
                where: { sessionId: id },
                select: { id: true, role: true },
                orderBy: { createdAt: 'asc' },
            })
                .then(roles => roles
                .slice(roles.findLastIndex(({ role }) => role === AiPromptRole.user) + 1)
                .map(({ id }) => id));
            if (ids.length) {
                await tx.aiSessionMessage.deleteMany({ where: { id: { in: ids } } });
            }
        });
    }
    calculateTokenSize(messages, model) {
        const encoder = getTokenEncoder(model);
        return messages
            .map(m => encoder?.count(m.content) ?? 0)
            .reduce((total, length) => total + length, 0);
    }
    async countUserMessages(userId) {
        const sessions = await this.db.aiSession.findMany({
            where: { userId },
            select: { messageCost: true, prompt: { select: { action: true } } },
        });
        return sessions
            .map(({ messageCost, prompt: { action } }) => (action ? 1 : messageCost))
            .reduce((prev, cost) => prev + cost, 0);
    }
    async listSessions(userId, workspaceId, options) {
        return await this.db.aiSession
            .findMany({
            where: {
                userId,
                workspaceId,
                docId: workspaceId === options?.docId ? undefined : options?.docId,
                prompt: {
                    action: options?.action ? { not: null } : null,
                },
                deletedAt: null,
            },
            select: { id: true },
        })
            .then(sessions => sessions.map(({ id }) => id));
    }
    async listHistories(userId, workspaceId, docId, options, withPrompt = false) {
        return await this.db.aiSession
            .findMany({
            where: {
                userId,
                workspaceId: workspaceId,
                docId: workspaceId === docId ? undefined : docId,
                prompt: {
                    action: options?.action ? { not: null } : null,
                },
                id: options?.sessionId ? { equals: options.sessionId } : undefined,
                deletedAt: null,
            },
            select: {
                id: true,
                promptName: true,
                tokenCost: true,
                createdAt: true,
                messages: {
                    select: {
                        role: true,
                        content: true,
                        attachments: true,
                        params: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            take: options?.limit,
            skip: options?.skip,
            orderBy: { createdAt: 'desc' },
        })
            .then(sessions => Promise.all(sessions.map(async ({ id, promptName, tokenCost, messages, createdAt }) => {
            try {
                const ret = ChatMessageSchema.array().safeParse(messages);
                if (ret.success) {
                    const prompt = await this.prompt.get(promptName);
                    if (!prompt) {
                        throw new Error(`Prompt not found: ${promptName}`);
                    }
                    // render system prompt
                    const preload = withPrompt
                        ? prompt
                            .finish(ret.data[0]?.params || {}, id)
                            .filter(({ role }) => role !== 'system')
                        : [];
                    // `createdAt` is required for history sorting in frontend, let's fake the creating time of prompt messages
                    preload.forEach((msg, i) => {
                        msg.createdAt = new Date(createdAt.getTime() - preload.length - i - 1);
                    });
                    return {
                        sessionId: id,
                        action: prompt.action || undefined,
                        tokens: tokenCost,
                        createdAt,
                        messages: preload.concat(ret.data),
                    };
                }
                else {
                    this.logger.error(`Unexpected message schema: ${JSON.stringify(ret.error)}`);
                }
            }
            catch (e) {
                this.logger.error('Unexpected error in listHistories', e);
            }
            return undefined;
        })))
            .then(histories => histories.filter((v) => !!v));
    }
    async getQuota(userId) {
        const isCopilotUser = await this.feature.isCopilotUser(userId);
        let limit;
        if (!isCopilotUser) {
            const quota = await this.quota.getUserQuota(userId);
            limit = quota.feature.copilotActionLimit;
        }
        const used = await this.countUserMessages(userId);
        return { limit, used };
    }
    async checkQuota(userId) {
        const { limit, used } = await this.getQuota(userId);
        if (limit && Number.isFinite(limit) && used >= limit) {
            throw new PaymentRequiredException(`You have reached the limit of actions in this workspace, please upgrade your plan.`);
        }
    }
    async create(options) {
        const sessionId = randomUUID();
        const prompt = await this.prompt.get(options.promptName);
        if (!prompt) {
            this.logger.error(`Prompt not found: ${options.promptName}`);
            throw new Error('Prompt not found');
        }
        return await this.setSession({
            ...options,
            sessionId,
            prompt,
            messages: [],
        });
    }
    async cleanup(options) {
        return await this.db.$transaction(async (tx) => {
            const sessions = await tx.aiSession.findMany({
                where: {
                    id: { in: options.sessionIds },
                    userId: options.userId,
                    workspaceId: options.workspaceId,
                    docId: options.docId,
                    deletedAt: null,
                },
                select: { id: true, promptName: true },
            });
            const sessionIds = sessions.map(({ id }) => id);
            // cleanup all messages
            await tx.aiSessionMessage.deleteMany({
                where: { sessionId: { in: sessionIds } },
            });
            // only mark action session as deleted
            // chat session always can be reuse
            const actionIds = (await Promise.all(sessions.map(({ id, promptName }) => this.prompt
                .get(promptName)
                .then(prompt => ({ id, action: !!prompt?.action })))))
                .filter(({ action }) => action)
                .map(({ id }) => id);
            await tx.aiSession.updateMany({
                where: { id: { in: actionIds } },
                data: { deletedAt: new Date() },
            });
            return [...sessionIds, ...actionIds];
        });
    }
    async createMessage(message) {
        return await this.messageCache.set(message);
    }
    /**
     * usage:
     * ``` typescript
     * {
     *     // allocate a session, can be reused chat in about 12 hours with same session
     *     await using session = await session.get(sessionId);
     *     session.push(message);
     *     copilot.generateText(session.finish(), model);
     * }
     * // session will be disposed after the block
     * @param sessionId session id
     * @returns
     */
    async get(sessionId) {
        const state = await this.getSession(sessionId);
        if (state) {
            return new ChatSession(this.messageCache, state, async (state) => {
                await this.setSession(state);
            });
        }
        return null;
    }
};
ChatSessionService = ChatSessionService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaClient,
        FeatureManagementService,
        QuotaService,
        ChatMessageCache,
        PromptService])
], ChatSessionService);
export { ChatSessionService };
//# sourceMappingURL=session.js.map