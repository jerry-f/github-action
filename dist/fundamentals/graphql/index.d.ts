import './config';
import { Request, Response } from 'express';
export type GraphqlContext = {
    req: Request;
    res: Response;
    isAdminQuery: boolean;
};
export declare class GqlModule {
}
//# sourceMappingURL=index.d.ts.map