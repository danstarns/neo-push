"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRelationshipMeta(field) {
    var _a, _b, _c;
    var directive = (_a = field.directives) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.name.value === "relationship"; });
    if (!directive) {
        return undefined;
    }
    var directionArg = (_b = directive.arguments) === null || _b === void 0 ? void 0 : _b.find(function (x) { return x.name.value === "direction"; });
    if (!directionArg) {
        throw new Error("@relationship direction required");
    }
    if (directionArg.value.kind !== "StringValue") {
        throw new Error("@relationship direction not a string");
    }
    if (!["IN", "OUT"].includes(directionArg.value.value)) {
        throw new Error("@relationship direction invalid");
    }
    var typeArg = (_c = directive.arguments) === null || _c === void 0 ? void 0 : _c.find(function (x) { return x.name.value === "type"; });
    if (!typeArg) {
        throw new Error("@relationship type required");
    }
    if (typeArg.value.kind !== "StringValue") {
        throw new Error("@relationship type not a string");
    }
    var direction = directionArg.value.value;
    var type = typeArg.value.value;
    return {
        direction: direction,
        type: type,
    };
}
exports.default = getRelationshipMeta;
//# sourceMappingURL=get-relationship-meta.js.map