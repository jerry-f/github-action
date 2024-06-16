import { Logger } from '@nestjs/common';
import { retryable } from '../utils/promise';
export class Lock {
    constructor(dispose) {
        this.dispose = dispose;
        this.logger = new Logger(Lock.name);
    }
    async release() {
        await retryable(() => this.dispose()).catch(e => {
            this.logger.error('Failed to release lock', e);
        });
    }
    async [Symbol.asyncDispose]() {
        await this.release();
    }
}
//# sourceMappingURL=lock.js.map