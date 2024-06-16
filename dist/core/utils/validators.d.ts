export declare function assertValidEmail(email: string): void;
export declare function assertValidPassword(password: string, { min, max }: {
    min: number;
    max: number;
}): void;
export declare const validators: {
    assertValidEmail: typeof assertValidEmail;
    assertValidPassword: typeof assertValidPassword;
};
//# sourceMappingURL=validators.d.ts.map