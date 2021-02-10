"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTime = exports.ID = exports.Int = exports.Float = void 0;
var graphql_1 = require("graphql");
var neo4j_driver_1 = require("neo4j-driver");
var temporal_types_1 = require("neo4j-driver/lib/temporal-types");
exports.Float = new graphql_1.GraphQLScalarType({
    name: "Float",
    parseValue: function (value) {
        // value from the client
        if (typeof value !== "number") {
            throw new Error("Cannot represent non number as Float");
        }
        return value;
    },
    serialize: function (value) {
        // value sent to the client
        return value;
    },
});
exports.Int = new graphql_1.GraphQLScalarType({
    name: "Int",
    parseValue: function (value) {
        // value from the client
        if (typeof value !== "number") {
            throw new Error("Cannot represent non number as Int");
        }
        return neo4j_driver_1.int(value);
    },
    serialize: function (value) {
        // value sent to the client
        if (value.toNumber) {
            return value.toNumber();
        }
        return value;
    },
});
/*
    https://spec.graphql.org/June2018/#sec-ID
    The ID type is serialized in the same way as a String
*/
exports.ID = new graphql_1.GraphQLScalarType({
    name: "ID",
    parseValue: function (value) {
        // value from the client
        if (typeof value === "string") {
            return value;
        }
        return value.toString(10);
    },
    serialize: function (value) {
        // value sent to the client
        if (typeof value === "string") {
            return value;
        }
        return value.toString(10);
    },
});
exports.DateTime = new graphql_1.GraphQLScalarType({
    name: "DateTime",
    description: "A date and time, represented as an ISO-8601 string",
    serialize: function (value) {
        // value sent to the client
        return new Date(value.toString()).toISOString();
    },
    parseValue: function (value) {
        // value from the client
        return temporal_types_1.DateTime.fromStandardDate(new Date(value));
    },
});
//# sourceMappingURL=scalars.js.map