import { createAdapter } from '@socket.io/redis-adapter';
import { SocketIoAdapter } from '../../fundamentals/websocket';
export function createSockerIoAdapterImpl(redis) {
    class RedisIoAdapter extends SocketIoAdapter {
        createIOServer(port, options) {
            const pubClient = redis;
            pubClient.on('error', err => {
                console.error(err);
            });
            const subClient = pubClient.duplicate();
            subClient.on('error', err => {
                console.error(err);
            });
            const server = super.createIOServer(port, options);
            server.adapter(createAdapter(pubClient, subClient));
            return server;
        }
    }
    return RedisIoAdapter;
}
//# sourceMappingURL=ws-adapter.js.map