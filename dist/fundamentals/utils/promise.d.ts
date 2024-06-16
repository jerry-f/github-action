export declare class RetryablePromise<T> extends Promise<T> {
    constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void, retryTimes?: number, retryIntervalInMs?: number);
}
export declare function retryable<Ret = unknown>(asyncFn: () => Promise<Ret>, retryTimes?: number, retryIntervalInMs?: number): Promise<Ret>;
export declare function defer(dispose: () => Promise<void>): {
    [Symbol.asyncDispose]: () => Promise<void>;
};
//# sourceMappingURL=promise.d.ts.map