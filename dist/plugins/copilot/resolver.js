var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var CopilotResolver_1;
import { createHash } from 'node:crypto';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Args, Field, ID, InputType, Mutation, ObjectType, Parent, Query, registerEnumType, ResolveField, Resolver, } from '@nestjs/graphql';
import { AiPromptRole } from '@prisma/client';
import { GraphQLJSON, SafeIntResolver } from 'graphql-scalars';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { CurrentUser } from '../../core/auth';
import { Admin } from '../../core/common';
import { UserType } from '../../core/user';
import { PermissionService } from '../../core/workspaces/permission';
import { MutexService, Throttle, TooManyRequestsException, } from '../../fundamentals';
import { PromptService } from './prompt';
import { ChatSessionService } from './session';
import { CopilotStorage } from './storage';
import { AvailableModels, } from './types';
registerEnumType(AvailableModels, { name: 'CopilotModel' });
export const COPILOT_LOCKER = 'copilot';
// ================== Input Types ==================
let CreateChatSessionInput = class CreateChatSessionInput {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CreateChatSessionInput.prototype, "workspaceId", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CreateChatSessionInput.prototype, "docId", void 0);
__decorate([
    Field(() => String, {
        description: 'The prompt name to use for the session',
    }),
    __metadata("design:type", String)
], CreateChatSessionInput.prototype, "promptName", void 0);
CreateChatSessionInput = __decorate([
    InputType()
], CreateChatSessionInput);
let DeleteSessionInput = class DeleteSessionInput {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], DeleteSessionInput.prototype, "workspaceId", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], DeleteSessionInput.prototype, "docId", void 0);
__decorate([
    Field(() => [String]),
    __metadata("design:type", Array)
], DeleteSessionInput.prototype, "sessionIds", void 0);
DeleteSessionInput = __decorate([
    InputType()
], DeleteSessionInput);
let CreateChatMessageInput = class CreateChatMessageInput {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CreateChatMessageInput.prototype, "sessionId", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], CreateChatMessageInput.prototype, "content", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    __metadata("design:type", Object)
], CreateChatMessageInput.prototype, "attachments", void 0);
__decorate([
    Field(() => [GraphQLUpload], { nullable: true }),
    __metadata("design:type", Object)
], CreateChatMessageInput.prototype, "blobs", void 0);
__decorate([
    Field(() => GraphQLJSON, { nullable: true }),
    __metadata("design:type", Object)
], CreateChatMessageInput.prototype, "params", void 0);
CreateChatMessageInput = __decorate([
    InputType()
], CreateChatMessageInput);
let QueryChatHistoriesInput = class QueryChatHistoriesInput {
};
__decorate([
    Field(() => Boolean, { nullable: true }),
    __metadata("design:type", Object)
], QueryChatHistoriesInput.prototype, "action", void 0);
__decorate([
    Field(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], QueryChatHistoriesInput.prototype, "limit", void 0);
__decorate([
    Field(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], QueryChatHistoriesInput.prototype, "skip", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], QueryChatHistoriesInput.prototype, "sessionId", void 0);
QueryChatHistoriesInput = __decorate([
    InputType()
], QueryChatHistoriesInput);
// ================== Return Types ==================
let ChatMessageType = class ChatMessageType {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], ChatMessageType.prototype, "role", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], ChatMessageType.prototype, "content", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ChatMessageType.prototype, "attachments", void 0);
__decorate([
    Field(() => GraphQLJSON, { nullable: true }),
    __metadata("design:type", Object)
], ChatMessageType.prototype, "params", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], ChatMessageType.prototype, "createdAt", void 0);
ChatMessageType = __decorate([
    ObjectType('ChatMessage')
], ChatMessageType);
let CopilotHistoriesType = class CopilotHistoriesType {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CopilotHistoriesType.prototype, "sessionId", void 0);
__decorate([
    Field(() => String, {
        description: 'An mark identifying which view to use to display the session',
        nullable: true,
    }),
    __metadata("design:type", Object)
], CopilotHistoriesType.prototype, "action", void 0);
__decorate([
    Field(() => Number, {
        description: 'The number of tokens used in the session',
    }),
    __metadata("design:type", Number)
], CopilotHistoriesType.prototype, "tokens", void 0);
__decorate([
    Field(() => [ChatMessageType]),
    __metadata("design:type", Array)
], CopilotHistoriesType.prototype, "messages", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], CopilotHistoriesType.prototype, "createdAt", void 0);
CopilotHistoriesType = __decorate([
    ObjectType('CopilotHistories')
], CopilotHistoriesType);
let CopilotQuotaType = class CopilotQuotaType {
};
__decorate([
    Field(() => SafeIntResolver, { nullable: true }),
    __metadata("design:type", Number)
], CopilotQuotaType.prototype, "limit", void 0);
__decorate([
    Field(() => SafeIntResolver),
    __metadata("design:type", Number)
], CopilotQuotaType.prototype, "used", void 0);
CopilotQuotaType = __decorate([
    ObjectType('CopilotQuota')
], CopilotQuotaType);
registerEnumType(AiPromptRole, {
    name: 'CopilotPromptMessageRole',
});
let CopilotPromptMessageType = class CopilotPromptMessageType {
};
__decorate([
    Field(() => AiPromptRole),
    __metadata("design:type", String)
], CopilotPromptMessageType.prototype, "role", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CopilotPromptMessageType.prototype, "content", void 0);
__decorate([
    Field(() => GraphQLJSON, { nullable: true }),
    __metadata("design:type", Object)
], CopilotPromptMessageType.prototype, "params", void 0);
CopilotPromptMessageType = __decorate([
    InputType('CopilotPromptMessageInput'),
    ObjectType()
], CopilotPromptMessageType);
registerEnumType(AvailableModels, { name: 'CopilotModels' });
let CopilotPromptType = class CopilotPromptType {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CopilotPromptType.prototype, "name", void 0);
__decorate([
    Field(() => AvailableModels),
    __metadata("design:type", String)
], CopilotPromptType.prototype, "model", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], CopilotPromptType.prototype, "action", void 0);
__decorate([
    Field(() => [CopilotPromptMessageType]),
    __metadata("design:type", Array)
], CopilotPromptType.prototype, "messages", void 0);
CopilotPromptType = __decorate([
    ObjectType()
], CopilotPromptType);
// ================== Resolver ==================
let CopilotType = class CopilotType {
};
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", Object)
], CopilotType.prototype, "workspaceId", void 0);
CopilotType = __decorate([
    ObjectType('Copilot')
], CopilotType);
export { CopilotType };
let CopilotResolver = CopilotResolver_1 = class CopilotResolver {
    constructor(permissions, mutex, chatSession, storage) {
        this.permissions = permissions;
        this.mutex = mutex;
        this.chatSession = chatSession;
        this.storage = storage;
        this.logger = new Logger(CopilotResolver_1.name);
    }
    async getQuota(user) {
        return await this.chatSession.getQuota(user.id);
    }
    async chats(copilot, user) {
        if (!copilot.workspaceId)
            return [];
        await this.permissions.checkCloudWorkspace(copilot.workspaceId, user.id);
        return await this.chatSession.listSessions(user.id, copilot.workspaceId);
    }
    async actions(copilot, user) {
        if (!copilot.workspaceId)
            return [];
        await this.permissions.checkCloudWorkspace(copilot.workspaceId, user.id);
        return await this.chatSession.listSessions(user.id, copilot.workspaceId, {
            action: true,
        });
    }
    async histories(copilot, user, docId, options) {
        const workspaceId = copilot.workspaceId;
        if (!workspaceId) {
            return [];
        }
        else if (docId) {
            await this.permissions.checkCloudPagePermission(workspaceId, docId, user.id);
        }
        else {
            await this.permissions.checkCloudWorkspace(workspaceId, user.id);
        }
        const histories = await this.chatSession.listHistories(user.id, workspaceId, docId, options, true);
        return histories.map(h => ({
            ...h,
            // filter out empty messages
            messages: h.messages.filter(m => m.content || m.attachments?.length),
        }));
    }
    async createCopilotSession(user, options) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            await this.permissions.checkCloudPagePermission(options.workspaceId, options.docId, user.id);
            const lockFlag = `${COPILOT_LOCKER}:session:${user.id}:${options.workspaceId}`;
            const lock = __addDisposableResource(env_1, await this.mutex.lock(lockFlag), true);
            if (!lock) {
                return new TooManyRequestsException('Server is busy');
            }
            await this.chatSession.checkQuota(user.id);
            const session = await this.chatSession.create({
                ...options,
                userId: user.id,
            });
            return session;
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            const result_1 = __disposeResources(env_1);
            if (result_1)
                await result_1;
        }
    }
    async cleanupCopilotSession(user, options) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            await this.permissions.checkCloudPagePermission(options.workspaceId, options.docId, user.id);
            if (!options.sessionIds.length) {
                return new NotFoundException('Session not found');
            }
            const lockFlag = `${COPILOT_LOCKER}:session:${user.id}:${options.workspaceId}`;
            const lock = __addDisposableResource(env_2, await this.mutex.lock(lockFlag), true);
            if (!lock) {
                return new TooManyRequestsException('Server is busy');
            }
            return await this.chatSession.cleanup({
                ...options,
                userId: user.id,
            });
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            const result_2 = __disposeResources(env_2);
            if (result_2)
                await result_2;
        }
    }
    async createCopilotMessage(user, options) {
        const env_3 = { stack: [], error: void 0, hasError: false };
        try {
            const lockFlag = `${COPILOT_LOCKER}:message:${user?.id}:${options.sessionId}`;
            const lock = __addDisposableResource(env_3, await this.mutex.lock(lockFlag), true);
            if (!lock) {
                return new TooManyRequestsException('Server is busy');
            }
            const session = await this.chatSession.get(options.sessionId);
            if (!session || session.config.userId !== user.id) {
                return new BadRequestException('Session not found');
            }
            if (options.blobs) {
                options.attachments = options.attachments || [];
                const { workspaceId } = session.config;
                const blobs = await Promise.all(options.blobs);
                delete options.blobs;
                for (const blob of blobs) {
                    const uploaded = await this.storage.handleUpload(user.id, blob);
                    const filename = createHash('sha256')
                        .update(uploaded.buffer)
                        .digest('base64url');
                    const link = await this.storage.put(user.id, workspaceId, filename, uploaded.buffer);
                    options.attachments.push(link);
                }
            }
            try {
                return await this.chatSession.createMessage(options);
            }
            catch (e) {
                this.logger.error(`Failed to create chat message: ${e.message}`);
                throw new Error('Failed to create chat message');
            }
        }
        catch (e_3) {
            env_3.error = e_3;
            env_3.hasError = true;
        }
        finally {
            const result_3 = __disposeResources(env_3);
            if (result_3)
                await result_3;
        }
    }
};
__decorate([
    ResolveField(() => CopilotQuotaType, {
        name: 'quota',
        description: 'Get the quota of the user in the workspace',
        complexity: 2,
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CopilotResolver.prototype, "getQuota", null);
__decorate([
    ResolveField(() => [String], {
        description: 'Get the session list of chats in the workspace',
        complexity: 2,
    }),
    __param(0, Parent()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CopilotType, Object]),
    __metadata("design:returntype", Promise)
], CopilotResolver.prototype, "chats", null);
__decorate([
    ResolveField(() => [String], {
        description: 'Get the session list of actions in the workspace',
        complexity: 2,
    }),
    __param(0, Parent()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CopilotType, Object]),
    __metadata("design:returntype", Promise)
], CopilotResolver.prototype, "actions", null);
__decorate([
    ResolveField(() => [CopilotHistoriesType], {}),
    __param(0, Parent()),
    __param(1, CurrentUser()),
    __param(2, Args('docId', { nullable: true })),
    __param(3, Args({
        name: 'options',
        type: () => QueryChatHistoriesInput,
        nullable: true,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CopilotType, Object, String, QueryChatHistoriesInput]),
    __metadata("design:returntype", Promise)
], CopilotResolver.prototype, "histories", null);
__decorate([
    Mutation(() => String, {
        description: 'Create a chat session',
    }),
    __param(0, CurrentUser()),
    __param(1, Args({ name: 'options', type: () => CreateChatSessionInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateChatSessionInput]),
    __metadata("design:returntype", Promise)
], CopilotResolver.prototype, "createCopilotSession", null);
__decorate([
    Mutation(() => [String], {
        description: 'Cleanup sessions',
    }),
    __param(0, CurrentUser()),
    __param(1, Args({ name: 'options', type: () => DeleteSessionInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, DeleteSessionInput]),
    __metadata("design:returntype", Promise)
], CopilotResolver.prototype, "cleanupCopilotSession", null);
__decorate([
    Mutation(() => String, {
        description: 'Create a chat message',
    }),
    __param(0, CurrentUser()),
    __param(1, Args({ name: 'options', type: () => CreateChatMessageInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateChatMessageInput]),
    __metadata("design:returntype", Promise)
], CopilotResolver.prototype, "createCopilotMessage", null);
CopilotResolver = CopilotResolver_1 = __decorate([
    Throttle(),
    Resolver(() => CopilotType),
    __metadata("design:paramtypes", [PermissionService,
        MutexService,
        ChatSessionService,
        CopilotStorage])
], CopilotResolver);
export { CopilotResolver };
let UserCopilotResolver = class UserCopilotResolver {
    constructor(permissions) {
        this.permissions = permissions;
    }
    async copilot(user, workspaceId) {
        if (workspaceId) {
            await this.permissions.checkCloudWorkspace(workspaceId, user.id);
        }
        return { workspaceId };
    }
};
__decorate([
    ResolveField(() => CopilotType),
    __param(0, CurrentUser()),
    __param(1, Args('workspaceId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserCopilotResolver.prototype, "copilot", null);
UserCopilotResolver = __decorate([
    Throttle(),
    Resolver(() => UserType),
    __metadata("design:paramtypes", [PermissionService])
], UserCopilotResolver);
export { UserCopilotResolver };
let CreateCopilotPromptInput = class CreateCopilotPromptInput {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CreateCopilotPromptInput.prototype, "name", void 0);
__decorate([
    Field(() => AvailableModels),
    __metadata("design:type", String)
], CreateCopilotPromptInput.prototype, "model", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], CreateCopilotPromptInput.prototype, "action", void 0);
__decorate([
    Field(() => [CopilotPromptMessageType]),
    __metadata("design:type", Array)
], CreateCopilotPromptInput.prototype, "messages", void 0);
CreateCopilotPromptInput = __decorate([
    InputType()
], CreateCopilotPromptInput);
let PromptsManagementResolver = class PromptsManagementResolver {
    constructor(promptService) {
        this.promptService = promptService;
    }
    async listCopilotPrompts() {
        return this.promptService.list();
    }
    async createCopilotPrompt(input) {
        await this.promptService.set(input.name, input.model, input.messages);
        return this.promptService.get(input.name);
    }
    async updateCopilotPrompt(name, messages) {
        await this.promptService.update(name, messages);
        return this.promptService.get(name);
    }
};
__decorate([
    Query(() => [CopilotPromptType], {
        description: 'List all copilot prompts',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromptsManagementResolver.prototype, "listCopilotPrompts", null);
__decorate([
    Mutation(() => CopilotPromptType, {
        description: 'Create a copilot prompt',
    }),
    __param(0, Args({ type: () => CreateCopilotPromptInput, name: 'input' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCopilotPromptInput]),
    __metadata("design:returntype", Promise)
], PromptsManagementResolver.prototype, "createCopilotPrompt", null);
__decorate([
    Mutation(() => CopilotPromptType, {
        description: 'Update a copilot prompt',
    }),
    __param(0, Args('name')),
    __param(1, Args('messages', { type: () => [CopilotPromptMessageType] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], PromptsManagementResolver.prototype, "updateCopilotPrompt", null);
PromptsManagementResolver = __decorate([
    Admin(),
    Resolver(() => String),
    __metadata("design:paramtypes", [PromptService])
], PromptsManagementResolver);
export { PromptsManagementResolver };
//# sourceMappingURL=resolver.js.map