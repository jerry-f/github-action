import { User } from '@prisma/client';
/**
 * Used to fetch current user from the request context.
 *
 * > The user may be undefined if authorization token or session cookie is not provided.
 *
 * @example
 *
 * ```typescript
 * // Graphql Query
 * \@Query(() => UserType)
 * user(@CurrentUser() user: CurrentUser) {
 *  return user;
 * }
 * ```
 *
 * ```typescript
 * // HTTP Controller
 * \@Get('/user')
 * user(@CurrentUser() user: CurrentUser) {
 *   return user;
 * }
 * ```
 *
 * ```typescript
 * // for public apis
 * \@Public()
 * \@Get('/session')
 * session(@currentUser() user?: CurrentUser) {
 *   return user
 * }
 * ```
 */
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
export interface CurrentUser extends Pick<User, 'id' | 'email' | 'avatarUrl' | 'name'> {
    hasPassword: boolean | null;
    emailVerified: boolean;
}
//# sourceMappingURL=current-user.d.ts.map