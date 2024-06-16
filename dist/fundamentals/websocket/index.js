var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
export const SocketIoAdapterImpl = Symbol('SocketIoAdapterImpl');
export class SocketIoAdapter extends IoAdapter {
}
const SocketIoAdapterImplProvider = {
    provide: SocketIoAdapterImpl,
    useValue: SocketIoAdapter,
};
let WebSocketModule = class WebSocketModule {
};
WebSocketModule = __decorate([
    Module({
        providers: [SocketIoAdapterImplProvider],
        exports: [SocketIoAdapterImplProvider],
    })
], WebSocketModule);
export { WebSocketModule };
//# sourceMappingURL=index.js.map