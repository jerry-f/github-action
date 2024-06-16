import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { CurrentUser } from '../../core/auth/current-user';
import { Config } from '../../fundamentals';
import { CopilotProviderService } from './providers';
import { ChatSessionService } from './session';
import { CopilotStorage } from './storage';
import { CopilotWorkflowService } from './workflow';
export interface ChatEvent {
    type: 'attachment' | 'message' | 'error';
    id?: string;
    data: string;
}
export declare class CopilotController {
    private readonly config;
    private readonly chatSession;
    private readonly provider;
    private readonly workflow;
    private readonly storage;
    private readonly logger;
    constructor(config: Config, chatSession: ChatSessionService, provider: CopilotProviderService, workflow: CopilotWorkflowService, storage: CopilotStorage);
    private checkRequest;
    private chooseTextProvider;
    private appendSessionMessage;
    private getSignal;
    private parseNumber;
    private handleError;
    chat(user: CurrentUser, req: Request, sessionId: string, params: Record<string, string | string[]>): Promise<string>;
    chatStream(user: CurrentUser, req: Request, sessionId: string, params: Record<string, string>): Promise<Observable<ChatEvent>>;
    chatWorkflow(user: CurrentUser, req: Request, sessionId: string, params: Record<string, string>): Promise<Observable<ChatEvent>>;
    chatImagesStream(user: CurrentUser, req: Request, sessionId: string, params: Record<string, string>): Promise<Observable<ChatEvent>>;
    unsplashPhotos(req: Request, res: Response, params: Record<string, string>): Promise<void>;
    getBlob(res: Response, userId: string, workspaceId: string, key: string): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map