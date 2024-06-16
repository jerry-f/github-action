var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Global, Injectable, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule, OnEvent as RawOnEvent, } from '@nestjs/event-emitter';
let EventEmitter = class EventEmitter {
    constructor(emitter) {
        this.emitter = emitter;
    }
    emit(event, payload) {
        return this.emitter.emit(event, payload);
    }
    emitAsync(event, payload) {
        return this.emitter.emitAsync(event, payload);
    }
    on(event, handler) {
        return this.emitter.on(event, handler);
    }
    once(event, handler) {
        return this.emitter.once(event, handler);
    }
};
EventEmitter = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [EventEmitter2])
], EventEmitter);
export { EventEmitter };
export const OnEvent = RawOnEvent;
let EventModule = class EventModule {
};
EventModule = __decorate([
    Global(),
    Module({
        imports: [EventEmitterModule.forRoot()],
        providers: [EventEmitter],
        exports: [EventEmitter],
    })
], EventModule);
export { EventModule };
//# sourceMappingURL=index.js.map