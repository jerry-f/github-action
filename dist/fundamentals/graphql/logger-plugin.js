var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GQLLoggerPlugin_1;
import { Plugin } from '@nestjs/apollo';
import { HttpException, Logger } from '@nestjs/common';
import { metrics } from '../metrics/metrics';
let GQLLoggerPlugin = GQLLoggerPlugin_1 = class GQLLoggerPlugin {
    constructor() {
        this.logger = new Logger(GQLLoggerPlugin_1.name);
    }
    requestDidStart(ctx) {
        const res = ctx.contextValue.req.res;
        const operation = ctx.request.operationName;
        metrics.gql.counter('query_counter').add(1, { operation });
        const start = Date.now();
        function endTimer() {
            return Date.now() - start;
        }
        return Promise.resolve({
            willSendResponse: () => {
                const time = endTimer();
                res.setHeader('Server-Timing', `gql;dur=${time};desc="GraphQL"`);
                metrics.gql.histogram('query_duration').record(time, { operation });
                return Promise.resolve();
            },
            didEncounterErrors: ctx => {
                metrics.gql.counter('query_error_counter').add(1, { operation });
                ctx.errors.forEach(err => {
                    // only log non-user errors
                    let msg;
                    if (!err.originalError) {
                        msg = err.toString();
                    }
                    else {
                        const originalError = err.originalError;
                        // do not log client errors, and put more information in the error extensions.
                        if (!(originalError instanceof HttpException)) {
                            if (originalError.cause && originalError.cause instanceof Error) {
                                msg = originalError.cause.stack ?? originalError.cause.message;
                            }
                            else {
                                msg = originalError.stack ?? originalError.message;
                            }
                        }
                    }
                    if (msg) {
                        this.logger.error('GraphQL Unhandled Error', msg);
                    }
                });
                return Promise.resolve();
            },
        });
    }
};
GQLLoggerPlugin = GQLLoggerPlugin_1 = __decorate([
    Plugin()
], GQLLoggerPlugin);
export { GQLLoggerPlugin };
//# sourceMappingURL=logger-plugin.js.map