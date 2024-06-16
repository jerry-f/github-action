import { PrismaTransaction } from '../../fundamentals';
import { Quota } from './types';
export declare class QuotaConfig {
    readonly config: Quota;
    static get(tx: PrismaTransaction, featureId: number): Promise<QuotaConfig>;
    private constructor();
    get version(): number;
    get name(): import("./types").QuotaType;
    get blobLimit(): number;
    get businessBlobLimit(): number;
    get storageQuota(): number;
    get historyPeriod(): number;
    get historyPeriodFromNow(): Date;
    get memberLimit(): number;
    get copilotActionLimit(): number | undefined;
    get humanReadable(): {
        name: string;
        blobLimit: string;
        storageQuota: string;
        historyPeriod: string;
        memberLimit: string;
        copilotActionLimit: string;
    };
}
//# sourceMappingURL=quota.d.ts.map