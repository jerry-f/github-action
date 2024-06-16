var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { createCipheriv, createDecipheriv, createHash, createSign, createVerify, randomBytes, timingSafeEqual, } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { hash as hashPassword, verify as verifyPassword, } from '@node-rs/argon2';
import { Config } from '../config';
const NONCE_LENGTH = 12;
const AUTH_TAG_LENGTH = 12;
let CryptoHelper = class CryptoHelper {
    constructor(config) {
        this.keyPair = {
            publicKey: Buffer.from(config.crypto.secret.publicKey, 'utf8'),
            privateKey: Buffer.from(config.crypto.secret.privateKey, 'utf8'),
            sha256: {
                publicKey: this.sha256(config.crypto.secret.publicKey),
                privateKey: this.sha256(config.crypto.secret.privateKey),
            },
        };
    }
    sign(data) {
        const sign = createSign('rsa-sha256');
        sign.update(data, 'utf-8');
        sign.end();
        return sign.sign(this.keyPair.privateKey, 'base64');
    }
    verify(data, signature) {
        const verify = createVerify('rsa-sha256');
        verify.update(data, 'utf-8');
        verify.end();
        return verify.verify(this.keyPair.privateKey, signature, 'base64');
    }
    encrypt(data) {
        const iv = this.randomBytes();
        const cipher = createCipheriv('aes-256-gcm', this.keyPair.sha256.privateKey, iv, {
            authTagLength: AUTH_TAG_LENGTH,
        });
        const encrypted = Buffer.concat([
            cipher.update(data, 'utf-8'),
            cipher.final(),
        ]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, encrypted]).toString('base64');
    }
    decrypt(encrypted) {
        const buf = Buffer.from(encrypted, 'base64');
        const iv = buf.subarray(0, NONCE_LENGTH);
        const authTag = buf.subarray(NONCE_LENGTH, NONCE_LENGTH + AUTH_TAG_LENGTH);
        const encryptedToken = buf.subarray(NONCE_LENGTH + AUTH_TAG_LENGTH);
        const decipher = createDecipheriv('aes-256-gcm', this.keyPair.sha256.privateKey, iv, { authTagLength: AUTH_TAG_LENGTH });
        decipher.setAuthTag(authTag);
        const decrepted = decipher.update(encryptedToken, void 0, 'utf8');
        return decrepted + decipher.final('utf8');
    }
    encryptPassword(password) {
        return hashPassword(password);
    }
    verifyPassword(password, hash) {
        return verifyPassword(hash, password);
    }
    compare(lhs, rhs) {
        if (lhs.length !== rhs.length) {
            return false;
        }
        return timingSafeEqual(Buffer.from(lhs), Buffer.from(rhs));
    }
    randomBytes(length = NONCE_LENGTH) {
        return randomBytes(length);
    }
    sha256(data) {
        return createHash('sha256').update(data).digest();
    }
};
CryptoHelper = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config])
], CryptoHelper);
export { CryptoHelper };
//# sourceMappingURL=crypto.js.map