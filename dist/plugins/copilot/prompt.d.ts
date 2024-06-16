import { type Tokenizer } from '@affine/server-native';
import { AiPrompt, PrismaClient } from '@prisma/client';
import { PromptMessage, PromptParams } from './types';
export declare class ChatPrompt {
    readonly name: string;
    readonly action: string | undefined;
    readonly model: string;
    private readonly messages;
    private readonly logger;
    readonly encoder: Tokenizer | null;
    private readonly promptTokenSize;
    private readonly templateParamKeys;
    private readonly templateParams;
    static createFromPrompt(options: Omit<AiPrompt, 'id' | 'createdAt'> & {
        messages: PromptMessage[];
    }): ChatPrompt;
    constructor(name: string, action: string | undefined, model: string, messages: PromptMessage[]);
    /**
     * get prompt token size
     */
    get tokens(): number;
    /**
     * get prompt param keys in template
     */
    get paramKeys(): string[];
    /**
     * get prompt params
     */
    get params(): {
        [x: string]: string | string[];
    };
    encode(message: string): number;
    private checkParams;
    /**
     * render prompt messages with params
     * @param params record of params, e.g. { name: 'Alice' }
     * @returns e.g. [{ role: 'system', content: 'Hello, {{name}}' }] => [{ role: 'system', content: 'Hello, Alice' }]
     */
    finish(params: PromptParams, sessionId?: string): PromptMessage[];
}
export declare class PromptService {
    private readonly db;
    private readonly cache;
    constructor(db: PrismaClient);
    /**
     * list prompt names
     * @returns prompt names
     */
    listNames(): Promise<string[]>;
    list(): Promise<{
        name: string;
        messages: {
            content: string;
            role: import(".prisma/client").$Enums.AiPromptRole;
            params: import(".prisma/client").Prisma.JsonValue;
        }[];
        action: string | null;
        model: string;
    }[]>;
    /**
     * get prompt messages by prompt name
     * @param name prompt name
     * @returns prompt messages
     */
    get(name: string): Promise<ChatPrompt | null>;
    set(name: string, model: string, messages: PromptMessage[]): Promise<number>;
    update(name: string, messages: PromptMessage[]): Promise<number>;
    delete(name: string): Promise<number>;
}
//# sourceMappingURL=prompt.d.ts.map