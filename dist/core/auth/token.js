var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { CryptoHelper } from '../../fundamentals/helpers';
export var TokenType;
(function (TokenType) {
    TokenType[TokenType["SignIn"] = 0] = "SignIn";
    TokenType[TokenType["VerifyEmail"] = 1] = "VerifyEmail";
    TokenType[TokenType["ChangeEmail"] = 2] = "ChangeEmail";
    TokenType[TokenType["ChangePassword"] = 3] = "ChangePassword";
    TokenType[TokenType["Challenge"] = 4] = "Challenge";
})(TokenType || (TokenType = {}));
let TokenService = class TokenService {
    constructor(db, crypto) {
        this.db = db;
        this.crypto = crypto;
    }
    async createToken(type, credential, ttlInSec = 30 * 60) {
        const plaintextToken = randomUUID();
        const { token } = await this.db.verificationToken.create({
            data: {
                type,
                token: plaintextToken,
                credential,
                expiresAt: new Date(Date.now() + ttlInSec * 1000),
            },
        });
        return this.crypto.encrypt(token);
    }
    async verifyToken(type, token, { credential, keep, } = {}) {
        token = this.crypto.decrypt(token);
        const record = await this.db.verificationToken.findUnique({
            where: {
                type_token: {
                    token,
                    type,
                },
            },
        });
        if (!record) {
            return null;
        }
        const expired = record.expiresAt <= new Date();
        const valid = !expired && (!record.credential || record.credential === credential);
        if ((expired || valid) && !keep) {
            const deleted = await this.db.verificationToken.deleteMany({
                where: {
                    token,
                    type,
                },
            });
            // already deleted, means token has been used
            if (!deleted.count) {
                return null;
            }
        }
        return valid ? record : null;
    }
    async cleanExpiredTokens() {
        await this.db.verificationToken.deleteMany({
            where: {
                expiresAt: {
                    lte: new Date(),
                },
            },
        });
    }
};
__decorate([
    Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TokenService.prototype, "cleanExpiredTokens", null);
TokenService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaClient,
        CryptoHelper])
], TokenService);
export { TokenService };
//# sourceMappingURL=token.js.map