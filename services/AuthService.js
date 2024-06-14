"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
const UserRepo_1 = __importDefault(require("@src/repos/UserRepo"));
const PwdUtil_1 = __importDefault(require("@src/util/PwdUtil"));
const misc_1 = require("@src/util/misc");
const HttpStatusCodes_1 = __importDefault(require("@src/common/HttpStatusCodes"));
const RouteError_1 = __importDefault(require("@src/common/RouteError"));
exports.Errors = {
    Unauth: 'Unauthorized',
    EmailNotFound(email) {
        return `User with email "${email}" not found`;
    },
};
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = yield UserRepo_1.default.getOne(email);
        if (!user) {
            throw new RouteError_1.default(HttpStatusCodes_1.default.UNAUTHORIZED, exports.Errors.EmailNotFound(email));
        }
        const hash = ((_a = user.pwdHash) !== null && _a !== void 0 ? _a : ''), pwdPassed = yield PwdUtil_1.default.compare(password, hash);
        if (!pwdPassed) {
            yield (0, misc_1.tick)(500);
            throw new RouteError_1.default(HttpStatusCodes_1.default.UNAUTHORIZED, exports.Errors.Unauth);
        }
        return user;
    });
}
exports.default = {
    login,
};
