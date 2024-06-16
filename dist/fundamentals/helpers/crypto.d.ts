/// <reference types="node" />
import { Config } from '../config';
export declare class CryptoHelper {
    keyPair: {
        publicKey: Buffer;
        privateKey: Buffer;
        sha256: {
            publicKey: Buffer;
            privateKey: Buffer;
        };
    };
    constructor(config: Config);
    sign(data: string): string;
    verify(data: string, signature: string): boolean;
    encrypt(data: string): string;
    decrypt(encrypted: string): string;
    encryptPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    compare(lhs: string, rhs: string): boolean;
    randomBytes(length?: number): Buffer;
    sha256(data: string): Buffer;
}
//# sourceMappingURL=crypto.d.ts.map