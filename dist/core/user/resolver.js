var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException } from '@nestjs/common';
import { Args, Field, InputType, Int, Mutation, Query, ResolveField, Resolver, } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { isNil, omitBy } from 'lodash-es';
import { Config, CryptoHelper, Throttle, } from '../../fundamentals';
import { CurrentUser } from '../auth/current-user';
import { Public } from '../auth/guard';
import { sessionUser } from '../auth/service';
import { Admin } from '../common';
import { AvatarStorage } from '../storage';
import { validators } from '../utils/validators';
import { UserService } from './service';
import { DeleteAccount, RemoveAvatar, UpdateUserInput, UserOrLimitedUser, UserType, } from './types';
let UserResolver = class UserResolver {
    constructor(prisma, storage, users) {
        this.prisma = prisma;
        this.storage = storage;
        this.users = users;
    }
    async user(email, currentUser) {
        validators.assertValidEmail(email);
        // TODO: need to limit a user can only get another user witch is in the same workspace
        const user = await this.users.findUserWithHashedPasswordByEmail(email);
        // return empty response when user not exists
        if (!user)
            return null;
        if (currentUser) {
            return sessionUser(user);
        }
        // only return limited info when not logged in
        return {
            email: user.email,
            hasPassword: !!user.password,
        };
    }
    async invoiceCount(user) {
        return this.prisma.userInvoice.count({
            where: { userId: user.id },
        });
    }
    async uploadAvatar(user, avatar) {
        if (!user) {
            throw new BadRequestException(`User not found`);
        }
        const avatarUrl = await this.storage.put(`${user.id}-avatar`, avatar.createReadStream(), {
            contentType: avatar.mimetype,
        });
        return this.users.updateUser(user.id, { avatarUrl });
    }
    async updateUserProfile(user, input) {
        input = omitBy(input, isNil);
        if (Object.keys(input).length === 0) {
            return user;
        }
        return sessionUser(await this.users.updateUser(user.id, input));
    }
    async removeAvatar(user) {
        if (!user) {
            throw new BadRequestException(`User not found`);
        }
        await this.users.updateUser(user.id, { avatarUrl: null });
        return { success: true };
    }
    async deleteAccount(user) {
        await this.users.deleteUser(user.id);
        return { success: true };
    }
};
__decorate([
    Throttle('strict'),
    Query(() => UserOrLimitedUser, {
        name: 'user',
        description: 'Get user by email',
        nullable: true,
    }),
    Public(),
    __param(0, Args('email')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    ResolveField(() => Int, {
        name: 'invoiceCount',
        description: 'Get user invoice count',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "invoiceCount", null);
__decorate([
    Mutation(() => UserType, {
        name: 'uploadAvatar',
        description: 'Upload user avatar',
    }),
    __param(0, CurrentUser()),
    __param(1, Args({ name: 'avatar', type: () => GraphQLUpload })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "uploadAvatar", null);
__decorate([
    Mutation(() => UserType, {
        name: 'updateProfile',
    }),
    __param(0, CurrentUser()),
    __param(1, Args('input', { type: () => UpdateUserInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUserProfile", null);
__decorate([
    Mutation(() => RemoveAvatar, {
        name: 'removeAvatar',
        description: 'Remove user avatar',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "removeAvatar", null);
__decorate([
    Mutation(() => DeleteAccount),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteAccount", null);
UserResolver = __decorate([
    Resolver(() => UserType),
    __metadata("design:paramtypes", [PrismaClient,
        AvatarStorage,
        UserService])
], UserResolver);
export { UserResolver };
let ListUserInput = class ListUserInput {
};
__decorate([
    Field(() => Int, { nullable: true, defaultValue: 0 }),
    __metadata("design:type", Number)
], ListUserInput.prototype, "skip", void 0);
__decorate([
    Field(() => Int, { nullable: true, defaultValue: 20 }),
    __metadata("design:type", Number)
], ListUserInput.prototype, "first", void 0);
ListUserInput = __decorate([
    InputType()
], ListUserInput);
let CreateUserInput = class CreateUserInput {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], CreateUserInput.prototype, "email", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], CreateUserInput.prototype, "name", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", Object)
], CreateUserInput.prototype, "password", void 0);
CreateUserInput = __decorate([
    InputType()
], CreateUserInput);
let UserManagementResolver = class UserManagementResolver {
    constructor(db, user, crypto, config) {
        this.db = db;
        this.user = user;
        this.crypto = crypto;
        this.config = config;
    }
    async users(input) {
        const users = await this.db.user.findMany({
            select: { ...this.user.defaultUserSelect, password: true },
            skip: input.skip,
            take: input.first,
        });
        return users.map(sessionUser);
    }
    async getUser(id) {
        const user = await this.db.user.findUnique({
            select: { ...this.user.defaultUserSelect, password: true },
            where: {
                id,
            },
        });
        if (!user) {
            return null;
        }
        return sessionUser(user);
    }
    async createUser(input) {
        validators.assertValidEmail(input.email);
        if (input.password) {
            const config = await this.config.runtime.fetchAll({
                'auth/password.max': true,
                'auth/password.min': true,
            });
            validators.assertValidPassword(input.password, {
                max: config['auth/password.max'],
                min: config['auth/password.min'],
            });
        }
        const { id } = await this.user.createAnonymousUser(input.email, {
            password: input.password
                ? await this.crypto.encryptPassword(input.password)
                : undefined,
            registered: true,
        });
        // data returned by `createUser` does not satisfies `UserType`
        return this.getUser(id);
    }
    async deleteUser(id) {
        await this.user.deleteUser(id);
        return { success: true };
    }
};
__decorate([
    Query(() => [UserType], {
        description: 'List registered users',
    }),
    __param(0, Args({ name: 'filter', type: () => ListUserInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListUserInput]),
    __metadata("design:returntype", Promise)
], UserManagementResolver.prototype, "users", null);
__decorate([
    Query(() => UserType, {
        name: 'userById',
        description: 'Get user by id',
    }),
    __param(0, Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserManagementResolver.prototype, "getUser", null);
__decorate([
    Mutation(() => UserType, {
        description: 'Create a new user',
    }),
    __param(0, Args({ name: 'input', type: () => CreateUserInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserInput]),
    __metadata("design:returntype", Promise)
], UserManagementResolver.prototype, "createUser", null);
__decorate([
    Mutation(() => DeleteAccount, {
        description: 'Delete a user account',
    }),
    __param(0, Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserManagementResolver.prototype, "deleteUser", null);
UserManagementResolver = __decorate([
    Admin(),
    Resolver(() => UserType),
    __metadata("design:paramtypes", [PrismaClient,
        UserService,
        CryptoHelper,
        Config])
], UserManagementResolver);
export { UserManagementResolver };
//# sourceMappingURL=resolver.js.map