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
var graphql_1 = require("graphql");
var classes_1 = require("../classes");
function parseExcludeDirective(excludeDirective, type) {
    var _a;
    if (!excludeDirective || excludeDirective.name.value !== "exclude") {
        throw new Error("Undefined or incorrect directive passed into parseExcludeDirective function");
    }
    var error = new Error("type " + type + " does not implement directive " + excludeDirective.name.value + " correctly");
    var result = [];
    var allResolvers = ["create", "read", "update", "delete"];
    (_a = excludeDirective.arguments) === null || _a === void 0 ? void 0 : _a.forEach(function (argument) {
        if (argument.name.value !== "operations") {
            throw error;
        }
        else {
            var argumentValue = graphql_1.valueFromASTUntyped(argument.value);
            if (argument.value.kind === "ListValue") {
                argumentValue.forEach(function (val) {
                    if (allResolvers.includes(val)) {
                        result.push(val);
                    }
                    else {
                        throw error;
                    }
                });
            }
            else if (argumentValue === "*") {
                result.push.apply(result, __spread(allResolvers));
            }
        }
    });
    return new classes_1.Exclude({ operations: result });
}
exports.default = parseExcludeDirective;
//# sourceMappingURL=parse-exclude-directive.js.map