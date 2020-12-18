"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkRoles(_a) {
    var node = _a.node, context = _a.context, operation = _a.operation;
    if (!node.auth) {
        return;
    }
    var rulesToCheck = node.auth.rules.filter(function (x) { var _a; return ((_a = x.operations) === null || _a === void 0 ? void 0 : _a.includes(operation)) && x.isAuthenticated !== false; });
    var allowStar = rulesToCheck.filter(function (x) { return x.allow && x.allow === "*"; });
    if (allowStar.length) {
        return;
    }
    if (!rulesToCheck.length) {
        return;
    }
    var jwt = context.getJWT();
    if (!jwt) {
        throw new Error("Unauthorized");
    }
    var roles = jwt.Roles || jwt.roles || jwt.Role || jwt.role || [];
    rulesToCheck.forEach(function (rule) {
        if (rule.roles) {
            rule.roles.forEach(function (role) {
                if (!roles.includes(role)) {
                    throw new Error("Forbidden");
                }
            });
        }
    });
}
exports.default = checkRoles;
//# sourceMappingURL=check-roles.js.map