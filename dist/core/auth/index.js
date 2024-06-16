var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import './config';
import { Module } from '@nestjs/common';
import { FeatureModule } from '../features';
import { QuotaModule } from '../quota';
import { UserModule } from '../user';
import { AuthController } from './controller';
import { AuthGuard } from './guard';
import { AuthResolver } from './resolver';
import { AuthService } from './service';
import { TokenService, TokenType } from './token';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [FeatureModule, UserModule, QuotaModule],
        providers: [AuthService, AuthResolver, TokenService, AuthGuard],
        exports: [AuthService, AuthGuard],
        controllers: [AuthController],
    })
], AuthModule);
export { AuthModule };
export * from './guard';
export { ClientTokenType } from './resolver';
export { AuthService, TokenService, TokenType };
export * from './current-user';
//# sourceMappingURL=index.js.map