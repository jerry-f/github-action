var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DocHistoryManager_1;
import { isDeepStrictEqual } from 'node:util';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { Config, metrics, OnEvent } from '../../fundamentals';
import { QuotaService } from '../quota';
import { Permission } from '../workspaces/types';
import { isEmptyBuffer } from './manager';
let DocHistoryManager = DocHistoryManager_1 = class DocHistoryManager {
    constructor(config, db, quota) {
        this.config = config;
        this.db = db;
        this.quota = quota;
        this.logger = new Logger(DocHistoryManager_1.name);
    }
    onWorkspaceDeleted(workspaceId) {
        return this.db.snapshotHistory.deleteMany({
            where: {
                workspaceId,
            },
        });
    }
    onSnapshotDeleted({ workspaceId, id }) {
        return this.db.snapshotHistory.deleteMany({
            where: {
                workspaceId,
                id,
            },
        });
    }
    async onDocUpdated({ workspaceId, id, previous }, forceCreate = false) {
        const last = await this.last(workspaceId, id);
        let shouldCreateHistory = false;
        if (!last) {
            // never created
            shouldCreateHistory = true;
        }
        else if (last.timestamp === previous.updatedAt) {
            // no change
            shouldCreateHistory = false;
        }
        else if (
        // force
        forceCreate ||
            // last history created before interval in configs
            last.timestamp.getTime() <
                previous.updatedAt.getTime() - this.config.doc.history.interval) {
            shouldCreateHistory = true;
        }
        if (shouldCreateHistory) {
            // skip the history recording when no actual update on snapshot happended
            if (last && isDeepStrictEqual(last.state, previous.state)) {
                this.logger.debug(`State matches, skip creating history record for ${id} in workspace ${workspaceId}`);
                return;
            }
            if (isEmptyBuffer(previous.blob)) {
                this.logger.debug(`Doc is empty, skip creating history record for ${id} in workspace ${workspaceId}`);
                return;
            }
            await this.db.snapshotHistory
                .create({
                select: {
                    timestamp: true,
                },
                data: {
                    workspaceId,
                    id,
                    timestamp: previous.updatedAt,
                    blob: previous.blob,
                    state: previous.state,
                    expiredAt: await this.getExpiredDateFromNow(workspaceId),
                },
            })
                .catch(() => {
                // safe to ignore
                // only happens when duplicated history record created in multi processes
            });
            metrics.doc
                .counter('history_created_counter', {
                description: 'How many times the snapshot history created',
            })
                .add(1);
            this.logger.debug(`History created for ${id} in workspace ${workspaceId}.`);
        }
    }
    async list(workspaceId, id, before = new Date(), take = 10) {
        return this.db.snapshotHistory.findMany({
            select: {
                timestamp: true,
            },
            where: {
                workspaceId,
                id,
                timestamp: {
                    lt: before,
                },
                // only include the ones has not expired
                expiredAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
            take,
        });
    }
    async count(workspaceId, id) {
        return this.db.snapshotHistory.count({
            where: {
                workspaceId,
                id,
                expiredAt: {
                    gt: new Date(),
                },
            },
        });
    }
    async get(workspaceId, id, timestamp) {
        return this.db.snapshotHistory.findUnique({
            where: {
                workspaceId_id_timestamp: {
                    workspaceId,
                    id,
                    timestamp,
                },
                expiredAt: {
                    gt: new Date(),
                },
            },
        });
    }
    async last(workspaceId, id) {
        return this.db.snapshotHistory.findFirst({
            where: {
                workspaceId,
                id,
            },
            select: {
                timestamp: true,
                state: true,
            },
            orderBy: {
                timestamp: 'desc',
            },
        });
    }
    async recover(workspaceId, id, timestamp) {
        const history = await this.db.snapshotHistory.findUnique({
            where: {
                workspaceId_id_timestamp: {
                    workspaceId,
                    id,
                    timestamp,
                },
            },
        });
        if (!history) {
            throw new Error('Given history not found');
        }
        const oldSnapshot = await this.db.snapshot.findUnique({
            where: {
                id_workspaceId: {
                    id,
                    workspaceId,
                },
            },
        });
        if (!oldSnapshot) {
            // unreachable actually
            throw new Error('Given Doc not found');
        }
        // save old snapshot as one history record
        await this.onDocUpdated({ workspaceId, id, previous: oldSnapshot }, true);
        // WARN:
        //  we should never do the snapshot updating in recovering,
        //  which is not the solution in CRDT.
        //  let user revert in client and update the data in sync system
        //    `await this.db.snapshot.update();`
        metrics.doc
            .counter('history_recovered_counter', {
            description: 'How many times history recovered request happened',
        })
            .add(1);
        return history.timestamp;
    }
    async getExpiredDateFromNow(workspaceId) {
        const permission = await this.db.workspaceUserPermission.findFirst({
            select: {
                userId: true,
            },
            where: {
                workspaceId,
                type: Permission.Owner,
            },
        });
        if (!permission) {
            // unreachable actually
            throw new Error('Workspace owner not found');
        }
        const quota = await this.quota.getUserQuota(permission.userId);
        return quota.feature.historyPeriodFromNow;
    }
    async cleanupExpiredHistory() {
        await this.db.snapshotHistory.deleteMany({
            where: {
                expiredAt: {
                    lte: new Date(),
                },
            },
        });
    }
};
__decorate([
    OnEvent('workspace.deleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocHistoryManager.prototype, "onWorkspaceDeleted", null);
__decorate([
    OnEvent('snapshot.deleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocHistoryManager.prototype, "onSnapshotDeleted", null);
__decorate([
    OnEvent('snapshot.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocHistoryManager.prototype, "onDocUpdated", null);
__decorate([
    Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT /* everyday at 12am */),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocHistoryManager.prototype, "cleanupExpiredHistory", null);
DocHistoryManager = DocHistoryManager_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config,
        PrismaClient,
        QuotaService])
], DocHistoryManager);
export { DocHistoryManager };
//# sourceMappingURL=history.js.map