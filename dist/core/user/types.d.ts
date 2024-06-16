import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user';
export declare class UserType implements CurrentUser {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    emailVerified: boolean;
    hasPassword: boolean | null;
    createdAt?: Date | null;
}
export declare class LimitedUserType implements Partial<User> {
    email: string;
    hasPassword: boolean | null;
}
export declare const UserOrLimitedUser: UserType | LimitedUserType;
export declare class DeleteAccount {
    success: boolean;
}
export declare class RemoveAvatar {
    success: boolean;
}
export declare class UpdateUserInput implements Partial<User> {
    name?: string;
}
//# sourceMappingURL=types.d.ts.map