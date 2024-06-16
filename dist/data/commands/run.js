var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RunCommand_1, RevertCommand_1;
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { Command, CommandRunner } from 'nest-commander';
export async function collectMigrations() {
    const folder = join(fileURLToPath(import.meta.url), '../../migrations');
    const migrationFiles = readdirSync(folder)
        .filter(desc => desc.endsWith(import.meta.url.endsWith('.ts') ? '.ts' : '.js'))
        .map(desc => join(folder, desc));
    migrationFiles.sort((a, b) => a.localeCompare(b));
    const migrations = await Promise.all(migrationFiles.map(async (file) => {
        return import(pathToFileURL(file).href).then(mod => {
            const migration = mod[Object.keys(mod)[0]];
            return {
                file,
                name: migration.name,
                up: migration.up,
                down: migration.down,
            };
        });
    }));
    return migrations;
}
let RunCommand = RunCommand_1 = class RunCommand extends CommandRunner {
    constructor(db, injector) {
        super();
        this.db = db;
        this.injector = injector;
        this.logger = new Logger(RunCommand_1.name);
    }
    async run() {
        const migrations = await collectMigrations();
        const done = [];
        for (const migration of migrations) {
            const exists = await this.db.dataMigration.count({
                where: {
                    name: migration.name,
                },
            });
            if (exists) {
                continue;
            }
            await this.runMigration(migration);
            done.push(migration);
        }
        this.logger.log(`Done ${done.length} migrations`);
        done.forEach(migration => {
            this.logger.log(`  ✔ ${migration.name}`);
        });
    }
    async runOne(name) {
        const migrations = await collectMigrations();
        const migration = migrations.find(m => m.name === name);
        if (!migration) {
            throw new Error(`Unknown migration name: ${name}.`);
        }
        const exists = await this.db.dataMigration.count({
            where: {
                name: migration.name,
            },
        });
        if (exists)
            return;
        await this.runMigration(migration);
    }
    async runMigration(migration) {
        this.logger.log(`Running ${migration.name}...`);
        const record = await this.db.dataMigration.create({
            data: {
                name: migration.name,
                startedAt: new Date(),
            },
        });
        try {
            await migration.up(this.db, this.injector);
        }
        catch (e) {
            await this.db.dataMigration.delete({
                where: {
                    id: record.id,
                },
            });
            await migration.down(this.db, this.injector);
            this.logger.error('Failed to run data migration', e);
            process.exit(1);
        }
        await this.db.dataMigration.update({
            where: {
                id: record.id,
            },
            data: {
                finishedAt: new Date(),
            },
        });
    }
};
RunCommand = RunCommand_1 = __decorate([
    Command({
        name: 'run',
        description: 'Run all pending data migrations',
    }),
    __metadata("design:paramtypes", [PrismaClient,
        ModuleRef])
], RunCommand);
export { RunCommand };
let RevertCommand = RevertCommand_1 = class RevertCommand extends CommandRunner {
    constructor(db, injector) {
        super();
        this.db = db;
        this.injector = injector;
        this.logger = new Logger(RevertCommand_1.name);
    }
    async run(inputs) {
        const name = inputs[0];
        if (!name) {
            throw new Error('A migration name is required');
        }
        const migrations = await collectMigrations();
        const migration = migrations.find(m => m.name === name);
        if (!migration) {
            this.logger.error('Available migration names:');
            migrations.forEach(m => {
                this.logger.error(`  - ${m.name}`);
            });
            throw new Error(`Unknown migration name: ${name}.`);
        }
        const record = await this.db.dataMigration.findFirst({
            where: {
                name: migration.name,
            },
        });
        if (!record) {
            throw new Error(`Migration ${name} has not been executed.`);
        }
        try {
            this.logger.log(`Reverting ${name}...`);
            await migration.down(this.db, this.injector);
            this.logger.log('Done reverting');
        }
        catch (e) {
            this.logger.error(`Failed to revert data migration ${name}`, e);
        }
        await this.db.dataMigration.delete({
            where: {
                id: record.id,
            },
        });
    }
};
RevertCommand = RevertCommand_1 = __decorate([
    Command({
        name: 'revert',
        arguments: '[name]',
        description: 'Revert one data migration with given name',
    }),
    __metadata("design:paramtypes", [PrismaClient,
        ModuleRef])
], RevertCommand);
export { RevertCommand };
//# sourceMappingURL=run.js.map