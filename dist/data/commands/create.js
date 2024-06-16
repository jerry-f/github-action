var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CreateCommand_1;
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '@nestjs/common';
import { camelCase, kebabCase, upperFirst } from 'lodash-es';
import { Command, CommandRunner, InquirerService, Question, QuestionSet, } from 'nest-commander';
let NameQuestion = class NameQuestion {
    parseName(val) {
        return val.trim();
    }
};
__decorate([
    Question({
        name: 'name',
        message: 'Name of the data migration script:',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NameQuestion.prototype, "parseName", null);
NameQuestion = __decorate([
    QuestionSet({ name: 'name-questions' })
], NameQuestion);
export { NameQuestion };
let CreateCommand = CreateCommand_1 = class CreateCommand extends CommandRunner {
    constructor(inquirer) {
        super();
        this.inquirer = inquirer;
        this.logger = new Logger(CreateCommand_1.name);
    }
    async run(inputs) {
        let name = inputs[0];
        if (!name) {
            name = (await this.inquirer.ask('name-questions', undefined)).name;
        }
        const timestamp = Date.now();
        const content = this.createScript(upperFirst(camelCase(name)) + timestamp);
        const fileName = `${timestamp}-${kebabCase(name)}.ts`;
        const filePath = join(fileURLToPath(import.meta.url), '../../migrations', fileName);
        this.logger.log(`Creating ${fileName}...`);
        writeFileSync(filePath, content);
        this.logger.log('Migration file created at', filePath);
        this.logger.log('Done');
    }
    createScript(name) {
        const contents = ["import { PrismaClient } from '@prisma/client';", ''];
        contents.push(`export class ${name} {`);
        contents.push('  // do the migration');
        contents.push('  static async up(db: PrismaClient) {}');
        contents.push('');
        contents.push('  // revert the migration');
        contents.push('  static async down(db: PrismaClient) {}');
        contents.push('}');
        return contents.join('\n');
    }
};
CreateCommand = CreateCommand_1 = __decorate([
    Command({
        name: 'create',
        arguments: '[name]',
        description: 'create a data migration script',
    }),
    __metadata("design:paramtypes", [InquirerService])
], CreateCommand);
export { CreateCommand };
//# sourceMappingURL=create.js.map