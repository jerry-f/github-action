var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get } from '@nestjs/common';
import { Public } from './core/auth';
import { Config, SkipThrottle } from './fundamentals';
let AppController = class AppController {
    constructor(config) {
        this.config = config;
    }
    info() {
        return {
            compatibility: this.config.version,
            message: `AFFiNE ${this.config.version} Server`,
            type: this.config.type,
            flavor: this.config.flavor,
        };
    }
};
__decorate([
    SkipThrottle(),
    Public(),
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "info", null);
AppController = __decorate([
    Controller('/'),
    __metadata("design:paramtypes", [Config])
], AppController);
export { AppController };
//# sourceMappingURL=app.controller.js.map