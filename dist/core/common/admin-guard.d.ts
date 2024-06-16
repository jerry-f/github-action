import type { CanActivate, ExecutionContext, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
export declare class AdminGuard implements CanActivate, OnModuleInit {
    private readonly ref;
    private feature;
    constructor(ref: ModuleRef);
    onModuleInit(): void;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
/**
 * This guard is used to protect routes/queries/mutations that require a user to be administrator.
 *
 * @example
 *
 * ```typescript
 * \@Admin()
 * \@Mutation(() => UserType)
 * createAccount(userInput: UserInput) {
 *   // ...
 * }
 * ```
 */
export declare const Admin: () => MethodDecorator & ClassDecorator;
//# sourceMappingURL=admin-guard.d.ts.map