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
const User_1 = require("@src/models/User");
const USER_UNAUTHORIZED_ERR = 'User not authorized to perform this action';
function adminMw(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionData = yield SessionUtil_1.default.getSessionData(req);
        if (typeof sessionData === 'object' &&
            (sessionData === null || sessionData === void 0 ? void 0 : sessionData.role) === User_1.UserRoles.Admin) {
            res.locals.sessionUser = sessionData;
            return next();
        }
        else {
            return res
                .status(HttpStatusCodes_1.default.UNAUTHORIZED)
                .json({ error: USER_UNAUTHORIZED_ERR });
        }
    });
}
exports.default = adminMw;
