import type { Response } from 'express';
import { Config } from '../config';
export declare class URLHelper {
    private readonly config;
    private readonly redirectAllowHosts;
    readonly origin: string;
    readonly baseUrl: string;
    readonly home: string;
    constructor(config: Config);
    stringify(query: Record<string, any>): string;
    url(path: string, query?: Record<string, any>): URL;
    link(path: string, query?: Record<string, any>): string;
    safeRedirect(res: Response, to: string): void;
    verify(url: string | URL): boolean;
}
//# sourceMappingURL=url.d.ts.map