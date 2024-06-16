import { EventEmitter2, OnEvent as RawOnEvent } from '@nestjs/event-emitter';
import type { Event, EventPayload } from './def';
export declare class EventEmitter {
    private readonly emitter;
    constructor(emitter: EventEmitter2);
    emit<E extends Event>(event: E, payload: EventPayload<E>): boolean;
    emitAsync<E extends Event>(event: E, payload: EventPayload<E>): Promise<any[]>;
    on<E extends Event>(event: E, handler: (payload: EventPayload<E>) => void): EventEmitter2 | import("eventemitter2").Listener;
    once<E extends Event>(event: E, handler: (payload: EventPayload<E>) => void): EventEmitter2 | import("eventemitter2").Listener;
}
export declare const OnEvent: (event: Event, opts?: Parameters<typeof RawOnEvent>[1]) => MethodDecorator;
export declare class EventModule {
}
export { Event, EventPayload };
//# sourceMappingURL=index.d.ts.map