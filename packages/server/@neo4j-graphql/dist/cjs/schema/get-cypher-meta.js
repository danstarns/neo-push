"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCypherMeta(field) {
    var _a, _b;
    var directive = (_a = field.directives) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.name.value === "cypher"; });
    if (!directive) {
        return undefined;
    }
    var stmtArg = (_b = directive.arguments) === null || _b === void 0 ? void 0 : _b.find(function (x) { return x.name.value === "statement"; });
    if (!stmtArg) {
        throw new Error("@cypher statement required");
    }
    if (stmtArg.value.kind !== "StringValue") {
        throw new Error("@cypher statement not a string");
    }
    var statement = stmtArg.value.value;
    return {
        statement: statement,
    };
}
exports.default = getCypherMeta;
//# sourceMappingURL=get-cypher-meta.js.map