import { defer as rxjsDefer, retry } from 'rxjs';
export class RetryablePromise extends Promise {
    constructor(executor, retryTimes = 3, retryIntervalInMs = 300) {
        super((resolve, reject) => {
            rxjsDefer(() => new Promise(executor))
                .pipe(retry({
                count: retryTimes,
                delay: retryIntervalInMs,
            }))
                .subscribe({
                next: v => {
                    resolve(v);
                },
                error: e => {
                    reject(e);
                },
            });
        });
    }
}
export function retryable(asyncFn, retryTimes = 3, retryIntervalInMs = 300) {
    return new RetryablePromise((resolve, reject) => {
        asyncFn().then(resolve).catch(reject);
    }, retryTimes, retryIntervalInMs);
}
export function defer(dispose) {
    return {
        [Symbol.asyncDispose]: dispose,
    };
}
//# sourceMappingURL=promise.js.map