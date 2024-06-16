import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { CommandRunner } from 'nest-commander';
interface Migration {
    file: string;
    name: string;
    up: (db: PrismaClient, injector: ModuleRef) => Promise<void>;
    down: (db: PrismaClient, injector: ModuleRef) => Promise<void>;
}
export declare function collectMigrations(): Promise<Migration[]>;
export declare class RunCommand extends CommandRunner {
    private readonly db;
    private readonly injector;
    logger: Logger;
    constructor(db: PrismaClient, injector: ModuleRef);
    run(): Promise<void>;
    runOne(name: string): Promise<void>;
    private runMigration;
}
export declare class RevertCommand extends CommandRunner {
    private readonly db;
    private readonly injector;
    logger: Logger;
    constructor(db: PrismaClient, injector: ModuleRef);
    run(inputs: string[]): Promise<void>;
}
export {};
//# sourceMappingURL=run.d.ts.map