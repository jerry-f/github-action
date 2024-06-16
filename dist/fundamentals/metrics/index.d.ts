import './config';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { OpentelemetryFactory } from './opentelemetry';
export declare class MetricsModule implements OnModuleInit, OnModuleDestroy {
    private readonly ref;
    private sdk;
    constructor(ref: ModuleRef);
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
}
export * from './metrics';
export * from './utils';
export { OpentelemetryFactory };
//# sourceMappingURL=index.d.ts.map