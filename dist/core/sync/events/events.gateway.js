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
var EventsGateway_1;
import { applyDecorators, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage as RawSubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { encodeStateAsUpdate, encodeStateVector } from 'yjs';
import { CallTimer, Config, metrics } from '../../../fundamentals';
import { Auth, CurrentUser } from '../../auth';
import { DocManager } from '../../doc';
import { DocID } from '../../utils/doc';
import { PermissionService } from '../../workspaces/permission';
import { Permission } from '../../workspaces/types';
import { AccessDeniedError, DocNotFoundError, EventError, EventErrorCode, InternalError, NotInWorkspaceError, } from './error';
export const GatewayErrorWrapper = () => {
    // @ts-expect-error allow
    return (_target, _key, desc) => {
        const originalMethod = desc.value;
        if (!originalMethod) {
            return desc;
        }
        desc.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (e) {
                if (e instanceof EventError) {
                    return {
                        error: e,
                    };
                }
                else {
                    metrics.socketio.counter('unhandled_errors').add(1);
                    new Logger('EventsGateway').error(e, e.stack);
                    return {
                        error: new InternalError(e),
                    };
                }
            }
        };
        return desc;
    };
};
const SubscribeMessage = (event) => applyDecorators(GatewayErrorWrapper(), CallTimer('socketio', 'event_duration', { event }), RawSubscribeMessage(event));
function Sync(workspaceId) {
    return `${workspaceId}:sync`;
}
function Awareness(workspaceId) {
    return `${workspaceId}:awareness`;
}
let EventsGateway = EventsGateway_1 = class EventsGateway {
    constructor(config, docManager, permissions) {
        this.config = config;
        this.docManager = docManager;
        this.permissions = permissions;
        this.logger = new Logger(EventsGateway_1.name);
        this.connectionCount = 0;
    }
    handleConnection() {
        this.connectionCount++;
        metrics.socketio.gauge('realtime_connections').record(this.connectionCount);
    }
    handleDisconnect() {
        this.connectionCount--;
        metrics.socketio.gauge('realtime_connections').record(this.connectionCount);
    }
    async assertVersion(client, version) {
        const shouldCheckClientVersion = await this.config.runtime.fetch('flags/syncClientVersionCheck');
        if (
        // @todo(@darkskygit): remove this flag after 0.12 goes stable
        shouldCheckClientVersion &&
            version !== AFFiNE.version) {
            client.emit('server-version-rejected', {
                currentVersion: version,
                requiredVersion: AFFiNE.version,
                reason: `Client version${version ? ` ${version}` : ''} is outdated, please update to ${AFFiNE.version}`,
            });
            throw new EventError(EventErrorCode.VERSION_REJECTED, `Client version ${version} is outdated, please update to ${AFFiNE.version}`);
        }
    }
    async joinWorkspace(client, room) {
        await client.join(room);
    }
    async leaveWorkspace(client, room) {
        await client.leave(room);
    }
    assertInWorkspace(client, room) {
        if (!client.rooms.has(room)) {
            throw new NotInWorkspaceError(room);
        }
    }
    async assertWorkspaceAccessible(workspaceId, userId, permission = Permission.Read) {
        if (!(await this.permissions.isWorkspaceMember(workspaceId, userId, permission))) {
            throw new AccessDeniedError(workspaceId);
        }
    }
    async handleClientHandshakeSync(user, workspaceId, version, client) {
        await this.assertVersion(client, version);
        await this.assertWorkspaceAccessible(workspaceId, user.id, Permission.Write);
        await this.joinWorkspace(client, Sync(workspaceId));
        return {
            data: {
                clientId: client.id,
            },
        };
    }
    async handleClientHandshakeAwareness(user, workspaceId, version, client) {
        await this.assertVersion(client, version);
        await this.assertWorkspaceAccessible(workspaceId, user.id, Permission.Write);
        await this.joinWorkspace(client, Awareness(workspaceId));
        return {
            data: {
                clientId: client.id,
            },
        };
    }
    async handleLeaveSync(workspaceId, client) {
        this.assertInWorkspace(client, Sync(workspaceId));
        await this.leaveWorkspace(client, Sync(workspaceId));
        return {};
    }
    async handleLeaveAwareness(workspaceId, client) {
        this.assertInWorkspace(client, Awareness(workspaceId));
        await this.leaveWorkspace(client, Awareness(workspaceId));
        return {};
    }
    async loadDocStats(client, { workspaceId, timestamp }) {
        this.assertInWorkspace(client, Sync(workspaceId));
        const stats = await this.docManager.getDocTimestamps(workspaceId, timestamp);
        return {
            data: stats,
        };
    }
    async handleClientUpdateV2({ workspaceId, guid, updates, }, client) {
        this.assertInWorkspace(client, Sync(workspaceId));
        const docId = new DocID(guid, workspaceId);
        const buffers = updates.map(update => Buffer.from(update, 'base64'));
        const timestamp = await this.docManager.batchPush(docId.workspace, docId.guid, buffers);
        client
            .to(Sync(workspaceId))
            .emit('server-updates', { workspaceId, guid, updates, timestamp });
        return {
            data: {
                accepted: true,
                timestamp,
            },
        };
    }
    async loadDocV2(client, { workspaceId, guid, stateVector, }) {
        this.assertInWorkspace(client, Sync(workspaceId));
        const docId = new DocID(guid, workspaceId);
        const res = await this.docManager.get(docId.workspace, docId.guid);
        if (!res) {
            return {
                error: new DocNotFoundError(workspaceId, docId.guid),
            };
        }
        const missing = Buffer.from(encodeStateAsUpdate(res.doc, stateVector ? Buffer.from(stateVector, 'base64') : undefined)).toString('base64');
        const state = Buffer.from(encodeStateVector(res.doc)).toString('base64');
        return {
            data: {
                missing,
                state,
                timestamp: res.timestamp,
            },
        };
    }
    async handleInitAwareness(workspaceId, client) {
        this.assertInWorkspace(client, Awareness(workspaceId));
        client.to(Awareness(workspaceId)).emit('new-client-awareness-init');
        return {
            data: {
                clientId: client.id,
            },
        };
    }
    async handleHelpGatheringAwareness({ workspaceId, awarenessUpdate, }, client) {
        this.assertInWorkspace(client, Awareness(workspaceId));
        client
            .to(Awareness(workspaceId))
            .emit('server-awareness-broadcast', { workspaceId, awarenessUpdate });
        return {};
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    Auth(),
    SubscribeMessage('client-handshake-sync'),
    __param(0, CurrentUser()),
    __param(1, MessageBody('workspaceId')),
    __param(2, MessageBody('version')),
    __param(3, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleClientHandshakeSync", null);
__decorate([
    Auth(),
    SubscribeMessage('client-handshake-awareness'),
    __param(0, CurrentUser()),
    __param(1, MessageBody('workspaceId')),
    __param(2, MessageBody('version')),
    __param(3, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleClientHandshakeAwareness", null);
__decorate([
    SubscribeMessage('client-leave-sync'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleLeaveSync", null);
__decorate([
    SubscribeMessage('client-leave-awareness'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleLeaveAwareness", null);
__decorate([
    SubscribeMessage('client-pre-sync'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "loadDocStats", null);
__decorate([
    SubscribeMessage('client-update-v2'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleClientUpdateV2", null);
__decorate([
    SubscribeMessage('doc-load-v2'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "loadDocV2", null);
__decorate([
    SubscribeMessage('awareness-init'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleInitAwareness", null);
__decorate([
    SubscribeMessage('awareness-update'),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Socket]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleHelpGatheringAwareness", null);
EventsGateway = EventsGateway_1 = __decorate([
    WebSocketGateway({
        cors: !AFFiNE.node.prod,
        transports: ['websocket'],
        // see: https://socket.io/docs/v4/server-options/#maxhttpbuffersize
        maxHttpBufferSize: 1e8, // 100 MB
    }),
    __metadata("design:paramtypes", [Config,
        DocManager,
        PermissionService])
], EventsGateway);
export { EventsGateway };
//# sourceMappingURL=events.gateway.js.map