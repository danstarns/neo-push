"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
function getAuth(directive) {
    var _a;
    var auth = { rules: [], type: "JWT" };
    var rules = (_a = directive.arguments) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.name.value === "rules"; });
    if (!rules) {
        throw new Error("auth rules required");
    }
    if (rules.value.kind !== "ListValue") {
        throw new Error("auth rules must be a ListValue");
    }
    auth.rules = graphql_1.valueFromASTUntyped(rules.value);
    return auth;
}
exports.default = getAuth;
//# sourceMappingURL=get-auth.js.map