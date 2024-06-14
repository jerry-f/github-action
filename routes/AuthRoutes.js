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
const HttpStatusCodes_1 = __importDefault(require("@src/common/HttpStatusCodes"));
const SessionUtil_1 = __importDefault(require("@src/util/SessionUtil"));
const AuthService_1 = __importDefault(require("@src/services/AuthService"));
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const user = yield AuthService_1.default.login(email, password);
        yield SessionUtil_1.default.addSessionData(res, {
            id: user.id,
            email: user.name,
            name: user.name,
            role: user.role,
        });
        return res.status(HttpStatusCodes_1.default.OK).end();
    });
}
function logout(_, res) {
    SessionUtil_1.default.clearCookie(res);
    return res.status(HttpStatusCodes_1.default.OK).end();
}
exports.default = {
    login,
    logout,
};
