/// <reference types="./global.d.ts" />
/// <reference types="express-serve-static-core" />
import { ApolloServerPlugin, GraphQLRequestContext, GraphQLRequestListener } from '@apollo/server';
import { Logger } from '@nestjs/common';
export interface RequestContext {
    req: Express.Request & {
        res: Express.Response;
    };
}
export declare class GQLLoggerPlugin implements ApolloServerPlugin {
    protected logger: Logger;
    requestDidStart(ctx: GraphQLRequestContext<RequestContext>): Promise<GraphQLRequestListener<GraphQLRequestContext<RequestContext>>>;
}
//# sourceMappingURL=logger-plugin.d.ts.map