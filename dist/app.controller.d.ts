import { Config } from './fundamentals';
export declare class AppController {
    private readonly config;
    constructor(config: Config);
    info(): {
        compatibility: string;
        message: string;
        type: import("./fundamentals").DeploymentType;
        flavor: {
            type: string;
            graphql: boolean;
            sync: boolean;
        };
    };
}
//# sourceMappingURL=app.controller.d.ts.map