import { GqlArgumentsHost } from '@nestjs/graphql';
export function getRequestResponseFromHost(host) {
    switch (host.getType()) {
        case 'graphql': {
            const gqlContext = GqlArgumentsHost.create(host).getContext();
            return {
                req: gqlContext.req,
                res: gqlContext.req.res,
            };
        }
        case 'http': {
            const http = host.switchToHttp();
            return {
                req: http.getRequest(),
                res: http.getResponse(),
            };
        }
        case 'ws': {
            const ws = host.switchToWs();
            const req = ws.getClient().client.conn.request;
            const cookieStr = req?.headers?.cookie ?? '';
            // patch cookies to match auth guard logic
            if (typeof cookieStr === 'string') {
                req.cookies = cookieStr.split(';').reduce((cookies, cookie) => {
                    const [key, val] = cookie.split('=');
                    if (key) {
                        cookies[decodeURIComponent(key.trim())] = val
                            ? decodeURIComponent(val.trim())
                            : val;
                    }
                    return cookies;
                }, {});
            }
            return { req };
        }
        case 'rpc': {
            const rpc = host.switchToRpc();
            const { req } = rpc.getContext();
            return {
                req,
                res: req.res,
            };
        }
    }
}
export function getRequestFromHost(host) {
    return getRequestResponseFromHost(host).req;
}
export function getRequestResponseFromContext(ctx) {
    return getRequestResponseFromHost(ctx);
}
//# sourceMappingURL=request.js.map