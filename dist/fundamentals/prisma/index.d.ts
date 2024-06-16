import { PrismaClient } from '@prisma/client';
export declare class PrismaModule {
}
export { PrismaService } from './service';
export type PrismaTransaction = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];
//# sourceMappingURL=index.d.ts.map