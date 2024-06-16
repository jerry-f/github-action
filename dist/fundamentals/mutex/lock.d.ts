export declare class Lock implements AsyncDisposable {
    private readonly dispose;
    private readonly logger;
    constructor(dispose: () => Promise<void>);
    release(): Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
}
export interface Locker {
    lock(owner: string, key: string): Promise<Lock>;
}
//# sourceMappingURL=lock.d.ts.map