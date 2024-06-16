var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import './config';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApolloDriver } from '@nestjs/apollo';
import { Global, HttpException, HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Config } from '../config';
import { GQLLoggerPlugin } from './logger-plugin';
let GqlModule = class GqlModule {
};
GqlModule = __decorate([
    Global(),
    Module({
        imports: [
            GraphQLModule.forRootAsync({
                driver: ApolloDriver,
                useFactory: (config) => {
                    return {
                        ...config.graphql,
                        path: `${config.server.path}/graphql`,
                        csrfPrevention: {
                            requestHeaders: ['content-type'],
                        },
                        autoSchemaFile: join(fileURLToPath(import.meta.url), config.node.test
                            ? '../../../../node_modules/.cache/schema.gql'
                            : '../../../schema.gql'),
                        sortSchema: true,
                        context: ({ req, res, }) => ({
                            req,
                            res,
                            isAdminQuery: false,
                        }),
                        includeStacktraceInErrorResponses: !config.node.prod,
                        plugins: [new GQLLoggerPlugin()],
                        formatError: (formattedError, error) => {
                            // @ts-expect-error allow assign
                            formattedError.extensions ??= {};
                            if (error instanceof GraphQLError &&
                                error.originalError instanceof HttpException) {
                                const statusCode = error.originalError.getStatus();
                                const statusName = HttpStatus[statusCode];
                                // originally be 'INTERNAL_SERVER_ERROR'
                                formattedError.extensions['code'] = statusCode;
                                formattedError.extensions['status'] = statusName;
                                delete formattedError.extensions['originalError'];
                                return formattedError;
                            }
                            else {
                                // @ts-expect-error allow assign
                                formattedError.message = 'Internal Server Error';
                                formattedError.extensions['code'] =
                                    HttpStatus.INTERNAL_SERVER_ERROR;
                                formattedError.extensions['status'] =
                                    HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];
                            }
                            return formattedError;
                        },
                    };
                },
                inject: [Config],
            }),
        ],
    })
], GqlModule);
export { GqlModule };
//# sourceMappingURL=index.js.map