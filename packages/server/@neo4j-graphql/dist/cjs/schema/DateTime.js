"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
function parseLiteral(ast) {
    if (!["StringValue"].includes(ast.kind)) {
        throw new Error("invalid DateTime");
    }
    if (ast.kind === "ListValue") {
        return ast.values.map(parseLiteral);
    }
    return new Date(ast.value);
}
var DateTime = new graphql_1.GraphQLScalarType({
    name: "DateTime",
    description: "A date and time, represented as an ISO-8601 string",
    serialize: function (value) {
        // What users get, deserialize turns it into a toISOString
        return value;
    },
    parseValue: function (value) {
        return new Date(value);
    },
    parseLiteral: parseLiteral,
});
exports.default = DateTime;
//# sourceMappingURL=DateTime.js.map