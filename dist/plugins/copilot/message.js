var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChatMessageCache_1;
import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { SessionCache } from '../../fundamentals';
import { SubmittedMessageSchema } from './types';
const CHAT_MESSAGE_KEY = 'chat-message';
const CHAT_MESSAGE_TTL = 3600 * 1 * 1000; // 1 hours
let ChatMessageCache = ChatMessageCache_1 = class ChatMessageCache {
    constructor(cache) {
        this.cache = cache;
        this.logger = new Logger(ChatMessageCache_1.name);
    }
    async get(id) {
        return await this.cache.get(`${CHAT_MESSAGE_KEY}:${id}`);
    }
    async set(message) {
        try {
            const parsed = SubmittedMessageSchema.safeParse(message);
            if (parsed.success) {
                const id = randomUUID();
                await this.cache.set(`${CHAT_MESSAGE_KEY}:${id}`, parsed.data, {
                    ttl: CHAT_MESSAGE_TTL,
                });
                return id;
            }
        }
        catch (e) {
            this.logger.error(`Failed to get chat message from cache: ${e.message}`);
        }
        return undefined;
    }
};
ChatMessageCache = ChatMessageCache_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SessionCache])
], ChatMessageCache);
export { ChatMessageCache };
//# sourceMappingURL=message.js.map