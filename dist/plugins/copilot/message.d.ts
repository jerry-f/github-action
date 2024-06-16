import { SessionCache } from '../../fundamentals';
import { SubmittedMessage } from './types';
export declare class ChatMessageCache {
    private readonly cache;
    private readonly logger;
    constructor(cache: SessionCache);
    get(id: string): Promise<SubmittedMessage | undefined>;
    set(message: SubmittedMessage): Promise<string | undefined>;
}
//# sourceMappingURL=message.d.ts.map