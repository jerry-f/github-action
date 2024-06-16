import { AiPromptRole, PrismaClient } from '@prisma/client';
type PromptMessage = {
    role: AiPromptRole;
    content: string;
    params?: Record<string, string | string[]>;
};
type Prompt = {
    name: string;
    action?: string;
    model: string;
    messages: PromptMessage[];
};
export declare const prompts: Prompt[];
export declare function refreshPrompts(db: PrismaClient): Promise<void>;
export {};
//# sourceMappingURL=prompts.d.ts.map