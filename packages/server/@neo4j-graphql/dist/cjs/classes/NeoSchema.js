"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NeoSchema = /** @class */ (function () {
    function NeoSchema(input) {
        this.schema = input.schema;
        this.nodes = input.nodes;
        this.options = input.options;
        this.resolvers = input.resolvers;
        this.typeDefs = input.typeDefs;
    }
    NeoSchema.prototype.model = function (name) {
        var found = this.nodes.find(function (n) { return n.name === name; });
        return found === null || found === void 0 ? void 0 : found.model;
    };
    return NeoSchema;
}());
exports.default = NeoSchema;
//# sourceMappingURL=NeoSchema.js.map