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
function mergeTypeDefs(typeDefs) {
    var arrayOfTypeDefs = Array.isArray(typeDefs) ? typeDefs : [typeDefs];
    return {
        kind: "Document",
        definitions: arrayOfTypeDefs.reduce(function (acc, type) {
            if (typeof type === "string") {
                return __spread(acc, graphql_1.parse(type).definitions);
            }
            return __spread(acc, graphql_1.parse(graphql_1.print(type)).definitions);
        }, []),
    };
}
exports.default = mergeTypeDefs;
//# sourceMappingURL=merge-typedefs.js.map