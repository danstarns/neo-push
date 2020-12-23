"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j_driver_1 = require("neo4j-driver");
function replacer(_, value) {
    if (neo4j_driver_1.isInt(value)) {
        return value.toNumber();
    }
    if (neo4j_driver_1.isDateTime(value)) {
        return new Date(value.toString()).toISOString();
    }
    return value;
}
function deserialize(result) {
    return JSON.parse(JSON.stringify(result, replacer));
}
exports.default = deserialize;
//# sourceMappingURL=deserialize.js.map