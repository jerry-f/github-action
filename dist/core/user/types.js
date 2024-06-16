var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { createUnionType, Field, ID, InputType, ObjectType, } from '@nestjs/graphql';
let UserType = class UserType {
};
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], UserType.prototype, "id", void 0);
__decorate([
    Field({ description: 'User name' }),
    __metadata("design:type", String)
], UserType.prototype, "name", void 0);
__decorate([
    Field({ description: 'User email' }),
    __metadata("design:type", String)
], UserType.prototype, "email", void 0);
__decorate([
    Field(() => String, { description: 'User avatar url', nullable: true }),
    __metadata("design:type", Object)
], UserType.prototype, "avatarUrl", void 0);
__decorate([
    Field(() => Boolean, {
        description: 'User email verified',
    }),
    __metadata("design:type", Boolean)
], UserType.prototype, "emailVerified", void 0);
__decorate([
    Field(() => Boolean, {
        description: 'User password has been set',
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserType.prototype, "hasPassword", void 0);
__decorate([
    Field(() => Date, {
        deprecationReason: 'useless',
        description: 'User email verified',
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserType.prototype, "createdAt", void 0);
UserType = __decorate([
    ObjectType()
], UserType);
export { UserType };
let LimitedUserType = class LimitedUserType {
};
__decorate([
    Field({ description: 'User email' }),
    __metadata("design:type", String)
], LimitedUserType.prototype, "email", void 0);
__decorate([
    Field(() => Boolean, {
        description: 'User password has been set',
        nullable: true,
    }),
    __metadata("design:type", Object)
], LimitedUserType.prototype, "hasPassword", void 0);
LimitedUserType = __decorate([
    ObjectType()
], LimitedUserType);
export { LimitedUserType };
export const UserOrLimitedUser = createUnionType({
    name: 'UserOrLimitedUser',
    types: () => [UserType, LimitedUserType],
    resolveType(value) {
        if (value.id) {
            return UserType;
        }
        return LimitedUserType;
    },
});
let DeleteAccount = class DeleteAccount {
};
__decorate([
    Field(),
    __metadata("design:type", Boolean)
], DeleteAccount.prototype, "success", void 0);
DeleteAccount = __decorate([
    ObjectType()
], DeleteAccount);
export { DeleteAccount };
let RemoveAvatar = class RemoveAvatar {
};
__decorate([
    Field(),
    __metadata("design:type", Boolean)
], RemoveAvatar.prototype, "success", void 0);
RemoveAvatar = __decorate([
    ObjectType()
], RemoveAvatar);
export { RemoveAvatar };
let UpdateUserInput = class UpdateUserInput {
};
__decorate([
    Field({ description: 'User name', nullable: true }),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "name", void 0);
UpdateUserInput = __decorate([
    InputType()
], UpdateUserInput);
export { UpdateUserInput };
//# sourceMappingURL=types.js.map