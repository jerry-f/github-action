import { BadRequestException } from '@nestjs/common';
import z from 'zod';
function assertValid(z, value) {
    const result = z.safeParse(value);
    if (!result.success) {
        const firstIssue = result.error.issues.at(0);
        if (firstIssue) {
            throw new BadRequestException(firstIssue.message);
        }
        else {
            throw new BadRequestException('Invalid credential');
        }
    }
}
export function assertValidEmail(email) {
    assertValid(z.string().email({ message: 'Invalid email address' }), email);
}
export function assertValidPassword(password, { min, max }) {
    assertValid(z
        .string()
        .min(min, { message: `Password must be ${min} or more charactors long` })
        .max(max, {
        message: `Password must be ${max} or fewer charactors long`,
    }), password);
}
export const validators = {
    assertValidEmail,
    assertValidPassword,
};
//# sourceMappingURL=validators.js.map