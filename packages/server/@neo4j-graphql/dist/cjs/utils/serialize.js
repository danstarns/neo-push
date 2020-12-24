"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j_driver_1 = require("neo4j-driver");
var temporal_types_1 = require("neo4j-driver/lib/temporal-types");
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
function traverse(v) {
    function reducer(res, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        return __assign(__assign({}, res), (_b = {}, _b[key] = traverse(value), _b));
    }
    if (Array.isArray(v)) {
        return v.map(function (x) { return traverse(x); });
    }
    if (v instanceof Date) {
        return temporal_types_1.DateTime.fromStandardDate(v);
    }
    switch (typeof v) {
        case "number":
            if (isFloat(v)) {
                return v;
            }
            return neo4j_driver_1.int(v);
        case "string":
            return v;
        case "boolean":
            return v;
        default:
            return Object.entries(v).reduce(reducer, {});
    }
}
function serialize(result) {
    return traverse(result);
}
exports.default = serialize;
//# sourceMappingURL=serialize.js.map