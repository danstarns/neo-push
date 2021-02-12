"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Node = /** @class */ (function () {
    function Node(input) {
        this.name = input.name;
        this.relationFields = input.relationFields;
        this.cypherFields = input.cypherFields;
        this.primitiveFields = input.primitiveFields;
        this.scalarFields = input.scalarFields;
        this.enumFields = input.enumFields;
        this.otherDirectives = input.otherDirectives;
        this.unionFields = input.unionFields;
        this.interfaceFields = input.interfaceFields;
        this.interfaces = input.interfaces;
        this.objectFields = input.objectFields;
        this.dateTimeFields = input.dateTimeFields;
        this.pointFields = input.pointFields;
        this.exclude = input.exclude;
        this.auth = input.auth;
        this.description = input.description;
        this.authableFields = __spread(input.primitiveFields, input.scalarFields, input.enumFields, input.unionFields, input.objectFields, input.dateTimeFields, input.pointFields, input.cypherFields);
        this.mutableFields = __spread(input.dateTimeFields, input.enumFields, input.objectFields, input.scalarFields, input.primitiveFields, input.interfaceFields, input.objectFields, input.unionFields, input.pointFields);
    }
    return Node;
}());
exports.default = Node;
//# sourceMappingURL=Node.js.map