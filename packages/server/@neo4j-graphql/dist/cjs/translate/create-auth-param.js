"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dot_prop_1 = __importDefault(require("dot-prop"));
function createAuthParam(_a) {
    var context = _a.context;
    var param = {
        isAuthenticated: false,
        roles: [],
        jwt: {},
    };
    try {
        var jwt = context.getJWT();
        if (!jwt) {
            return param;
        }
        var dotPropKey = process.env.JWT_ROLES_OBJECT_PATH;
        if (dotPropKey) {
            param.roles = dot_prop_1.default.get(jwt, dotPropKey);
        }
        else if (jwt.roles) {
            param.roles = jwt.roles;
        }
        param.jwt = jwt;
    }
    catch (error) {
        return param;
    }
    param.isAuthenticated = true;
    return param;
}
exports.default = createAuthParam;
//# sourceMappingURL=create-auth-param.js.map