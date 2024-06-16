var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
let GlobalExceptionFilter = class GlobalExceptionFilter extends BaseExceptionFilter {
    catch(exception, host) {
        // with useGlobalFilters, the context is always HTTP
        if (host.getType() === 'graphql') {
            // let Graphql LoggerPlugin handle it
            // see '../graphql/logger-plugin.ts'
            throw exception;
        }
        else {
            if (exception instanceof HttpException) {
                const res = host.switchToHttp().getResponse();
                res.status(exception.getStatus()).send(exception.getResponse());
                return;
            }
            else {
                super.catch(exception, host);
            }
        }
    }
};
GlobalExceptionFilter = __decorate([
    Catch()
], GlobalExceptionFilter);
export { GlobalExceptionFilter };
//# sourceMappingURL=exception.js.map