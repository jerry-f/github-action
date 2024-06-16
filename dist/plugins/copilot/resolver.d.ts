import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AiPromptRole } from '@prisma/client';
import { CurrentUser } from '../../core/auth';
import { PermissionService } from '../../core/workspaces/permission';
import { FileUpload, MutexService, TooManyRequestsException } from '../../fundamentals';
import { PromptService } from './prompt';
import { ChatSessionService } from './session';
import { CopilotStorage } from './storage';
import { AvailableModels, type ListHistoriesOptions, SubmittedMessage } from './types';
export declare const COPILOT_LOCKER = "copilot";
declare class CreateChatSessionInput {
    workspaceId: string;
    docId: string;
    promptName: string;
}
declare class DeleteSessionInput {
    workspaceId: string;
    docId: string;
    sessionIds: string[];
}
declare class CreateChatMessageInput implements Omit<SubmittedMessage, 'content'> {
    sessionId: string;
    content: string | undefined;
    attachments: string[] | undefined;
    blobs: Promise<FileUpload>[] | undefined;
    params: Record<string, string> | undefined;
}
declare class QueryChatHistoriesInput implements Partial<ListHistoriesOptions> {
    action: boolean | undefined;
    limit: number | undefined;
    skip: number | undefined;
    sessionId: string | undefined;
}
declare class CopilotPromptMessageType {
    role: AiPromptRole;
    content: string;
    params: Record<string, string> | null;
}
export declare class CopilotType {
    workspaceId: string | undefined;
}
export declare class CopilotResolver {
    private readonly permissions;
    private readonly mutex;
    private readonly chatSession;
    private readonly storage;
    private readonly logger;
    constructor(permissions: PermissionService, mutex: MutexService, chatSession: ChatSessionService, storage: CopilotStorage);
    getQuota(user: CurrentUser): Promise<{
        limit: number | undefined;
        used: number;
    }>;
    chats(copilot: CopilotType, user: CurrentUser): Promise<string[]>;
    actions(copilot: CopilotType, user: CurrentUser): Promise<string[]>;
    histories(copilot: CopilotType, user: CurrentUser, docId?: string, options?: QueryChatHistoriesInput): Promise<{
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
        createdAt: Date;
        sessionId: string;
        tokens: number;
        action?: string | undefined;
    }[]>;
    createCopilotSession(user: CurrentUser, options: CreateChatSessionInput): Promise<string | TooManyRequestsException>;
    cleanupCopilotSession(user: CurrentUser, options: DeleteSessionInput): Promise<string[] | TooManyRequestsException | NotFoundException>;
    createCopilotMessage(user: CurrentUser, options: CreateChatMessageInput): Promise<string | BadRequestException | TooManyRequestsException | undefined>;
}
export declare class UserCopilotResolver {
    private readonly permissions;
    constructor(permissions: PermissionService);
    copilot(user: CurrentUser, workspaceId?: string): Promise<{
        workspaceId: string | undefined;
    }>;
}
declare class CreateCopilotPromptInput {
    name: string;
    model: AvailableModels;
    action: string | null;
    messages: CopilotPromptMessageType[];
}
export declare class PromptsManagementResolver {
    private readonly promptService;
    constructor(promptService: PromptService);
    listCopilotPrompts(): Promise<{
        name: string;
        messages: {
            content: string;
            role: import(".prisma/client").$Enums.AiPromptRole;
            params: import(".prisma/client").Prisma.JsonValue;
        }[];
        action: string | null;
        model: string;
    }[]>;
    createCopilotPrompt(input: CreateCopilotPromptInput): Promise<import("./prompt").ChatPrompt | null>;
    updateCopilotPrompt(name: string, messages: CopilotPromptMessageType[]): Promise<import("./prompt").ChatPrompt | null>;
}
export {};
//# sourceMappingURL=resolver.d.ts.map