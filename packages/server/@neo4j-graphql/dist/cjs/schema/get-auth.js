"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var classes_1 = require("../classes");
function getAuth(directive) {
    var _a;
    var authConstructor = { rules: [] };
    var rules = (_a = directive.arguments) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.name.value === "rules"; });
    if (!rules) {
        throw new Error("auth rules required");
    }
    if (rules.value.kind !== "ListValue") {
        throw new Error("auth rules must be a ListValue");
    }
    var parsedRules = graphql_1.valueFromASTUntyped(rules.value);
    parsedRules.forEach(function (rule, index) {
        var valueIsObject = Boolean(!Array.isArray(rule) && Object.keys(rule).length && typeof rule !== "string");
        if (!valueIsObject) {
            throw new Error("rules[" + index + "] must be a ObjectValue");
        }
        if (!rule.operations) {
            throw new Error("rules[" + index + "].operations required");
        }
        if (!Array.isArray(rule.operations)) {
            throw new Error("rules[" + index + "].operations must be a ListValue");
        }
        if (!rule.operations.length) {
            throw new Error("rules[" + index + "].operations cant be empty");
        }
        rule.operations.forEach(function (op, opIndex) {
            if (typeof op !== "string") {
                throw new Error("rules[" + index + "].operations[" + opIndex + "] invalid");
            }
            if (!["create", "read", "update", "delete"].includes(op)) {
                throw new Error("rules[" + index + "].operations[" + opIndex + "] invalid");
            }
        });
        if (rule.isAuthenticated) {
            if (typeof rule.isAuthenticated !== "boolean") {
                throw new Error("rules[" + index + "].isAuthenticated must be a BooleanValue");
            }
        }
        if (rule.roles) {
            if (!Array.isArray(rule.roles)) {
                throw new Error("rules[" + index + "].roles must be a ListValue");
            }
            rule.roles.forEach(function (role, i) {
                if (typeof role !== "string") {
                    throw new Error("rules[" + index + "].roles[" + i + "] must be a StringValue");
                }
            });
        }
    });
    authConstructor.rules = parsedRules;
    return new classes_1.Auth(authConstructor);
}
exports.default = getAuth;
//# sourceMappingURL=get-auth.js.map