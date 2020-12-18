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
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
function traverse(v) {
    function reducer(res, _a) {
        var _b, _c;
        var _d = __read(_a, 2), key = _d[0], value = _d[1];
        if (Array.isArray(value)) {
            return __assign(__assign({}, res), (_b = {}, _b[key] = value.map(function (x) { return traverse(x); }), _b));
        }
        return __assign(__assign({}, res), (_c = {}, _c[key] = traverse(value), _c));
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