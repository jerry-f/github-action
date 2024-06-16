/// <reference types="node" />
import { BlobInputType, PutObjectMetadata } from './provider';
export declare function toBuffer(input: BlobInputType): Promise<Buffer>;
export declare function autoMetadata(blob: Buffer, raw: PutObjectMetadata): Promise<PutObjectMetadata>;
//# sourceMappingURL=utils.d.ts.map