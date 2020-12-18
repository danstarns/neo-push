"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var language_1 = require("graphql/language");
function valueOfObjectValueNode(ast) {
    return Object.values(ast.fields).reduce(function (a, b) {
        a[b.name.value] = parseValueNode(b.value);
        return a;
    }, {});
}
function parseValueNode(ast) {
    var result;
    switch (ast.kind) {
        case language_1.Kind.ENUM:
        case language_1.Kind.STRING:
            result = ast.value;
            break;
        case language_1.Kind.INT:
        case language_1.Kind.FLOAT:
            result = Number(ast.value);
            break;
        case language_1.Kind.BOOLEAN:
            result = Boolean(ast.value);
            break;
        case language_1.Kind.NULL:
            break;
        case language_1.Kind.LIST:
            result = ast.values.map(parseValueNode);
            break;
        case language_1.Kind.OBJECT:
            result = valueOfObjectValueNode(ast);
            break;
        default:
            throw new Error("invalid Kind: " + ast.kind);
    }
    return result;
}
exports.default = parseValueNode;
//# sourceMappingURL=parse-value-node.js.map