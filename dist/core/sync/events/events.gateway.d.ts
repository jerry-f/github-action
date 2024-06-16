import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Config } from '../../../fundamentals';
import { CurrentUser } from '../../auth';
import { DocManager } from '../../doc';
import { PermissionService } from '../../workspaces/permission';
import { Permission } from '../../workspaces/types';
import { EventError } from './error';
export declare const GatewayErrorWrapper: () => MethodDecorator;
type EventResponse<Data = any> = {
    error: EventError;
} | (Data extends never ? {
    data?: never;
} : {
    data: Data;
});
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly config;
    private readonly docManager;
    private readonly permissions;
    protected logger: Logger;
    private connectionCount;
    constructor(config: Config, docManager: DocManager, permissions: PermissionService);
    server: Server;
    handleConnection(): void;
    handleDisconnect(): void;
    assertVersion(client: Socket, version?: string): Promise<void>;
    joinWorkspace(client: Socket, room: `${string}:${'sync' | 'awareness'}`): Promise<void>;
    leaveWorkspace(client: Socket, room: `${string}:${'sync' | 'awareness'}`): Promise<void>;
    assertInWorkspace(client: Socket, room: `${string}:${'sync' | 'awareness'}`): void;
    assertWorkspaceAccessible(workspaceId: string, userId: string, permission?: Permission): Promise<void>;
    handleClientHandshakeSync(user: CurrentUser, workspaceId: string, version: string | undefined, client: Socket): Promise<EventResponse<{
        clientId: string;
    }>>;
    handleClientHandshakeAwareness(user: CurrentUser, workspaceId: string, version: string | undefined, client: Socket): Promise<EventResponse<{
        clientId: string;
    }>>;
    handleLeaveSync(workspaceId: string, client: Socket): Promise<EventResponse>;
    handleLeaveAwareness(workspaceId: string, client: Socket): Promise<EventResponse>;
    loadDocStats(client: Socket, { workspaceId, timestamp }: {
        workspaceId: string;
        timestamp?: number;
    }): Promise<EventResponse<Record<string, number>>>;
    handleClientUpdateV2({ workspaceId, guid, updates, }: {
        workspaceId: string;
        guid: string;
        updates: string[];
    }, client: Socket): Promise<EventResponse<{
        accepted: true;
        timestamp?: number;
    }>>;
    loadDocV2(client: Socket, { workspaceId, guid, stateVector, }: {
        workspaceId: string;
        guid: string;
        stateVector?: string;
    }): Promise<EventResponse<{
        missing: string;
        state?: string;
        timestamp: number;
    }>>;
    handleInitAwareness(workspaceId: string, client: Socket): Promise<EventResponse<{
        clientId: string;
    }>>;
    handleHelpGatheringAwareness({ workspaceId, awarenessUpdate, }: {
        workspaceId: string;
        awarenessUpdate: string;
    }, client: Socket): Promise<EventResponse>;
}
export {};
//# sourceMappingURL=events.gateway.d.ts.map