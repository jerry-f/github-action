import { Logger } from '@nestjs/common';
import { CommandRunner, InquirerService } from 'nest-commander';
export declare class NameQuestion {
    parseName(val: string): string;
}
export declare class CreateCommand extends CommandRunner {
    private readonly inquirer;
    logger: Logger;
    constructor(inquirer: InquirerService);
    run(inputs: string[]): Promise<void>;
    private createScript;
}
//# sourceMappingURL=create.d.ts.map