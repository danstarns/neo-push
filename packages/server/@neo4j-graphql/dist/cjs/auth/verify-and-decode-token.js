"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyAndDecodeToken(token) {
    var _a = process.env, JWT_SECRET = _a.JWT_SECRET, JWT_NO_VERIFY = _a.JWT_NO_VERIFY;
    if (!JWT_SECRET && JWT_NO_VERIFY) {
        return jsonwebtoken_1.default.decode(token);
    }
    return jsonwebtoken_1.default.verify(token, JWT_SECRET, {
        algorithms: ["HS256", "RS256"],
    });
}
exports.default = verifyAndDecodeToken;
//# sourceMappingURL=verify-and-decode-token.js.map