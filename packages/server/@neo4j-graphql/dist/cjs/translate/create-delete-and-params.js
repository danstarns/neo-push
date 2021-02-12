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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var create_where_and_params_1 = __importDefault(require("./create-where-and-params"));
var create_auth_and_params_1 = __importDefault(require("./create-auth-and-params"));
var constants_1 = require("../constants");
function createDeleteAndParams(_a) {
    var deleteInput = _a.deleteInput, varName = _a.varName, node = _a.node, parentVar = _a.parentVar, chainStr = _a.chainStr, withVars = _a.withVars, context = _a.context, insideDoWhen = _a.insideDoWhen;
    function reducer(res, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        var relationField = node.relationFields.find(function (x) { return key.startsWith(x.fieldName); });
        var unionTypeName = "";
        if (relationField) {
            var refNode_1;
            if (relationField.union) {
                _b = __read(key.split(relationField.fieldName + "_").join("").split("_"), 1), unionTypeName = _b[0];
                refNode_1 = context.neoSchema.nodes.find(function (x) { return x.name === unionTypeName; });
            }
            else {
                refNode_1 = context.neoSchema.nodes.find(function (x) { return x.name === relationField.typeMeta.name; });
            }
            var inStr_1 = relationField.direction === "IN" ? "<-" : "-";
            var outStr_1 = relationField.direction === "OUT" ? "->" : "-";
            var relTypeStr_1 = "[:" + relationField.type + "]";
            var deletes = relationField.typeMeta.array ? value : [value];
            deletes.forEach(function (d, index) {
                var _varName = chainStr ? "" + varName + index : varName + "_" + key + index;
                if (withVars) {
                    res.strs.push("WITH " + withVars.join(", "));
                }
                res.strs.push("OPTIONAL MATCH (" + parentVar + ")" + inStr_1 + relTypeStr_1 + outStr_1 + "(" + _varName + ":" + refNode_1.name + ")");
                if (d.where) {
                    var whereAndParams = create_where_and_params_1.default({
                        varName: _varName,
                        whereInput: d.where,
                        node: refNode_1,
                        context: context,
                    });
                    res.strs.push(whereAndParams[0]);
                    res.params = __assign(__assign({}, res.params), whereAndParams[1]);
                }
                if (refNode_1.auth) {
                    var authAndParams = create_auth_and_params_1.default({
                        entity: refNode_1,
                        operation: "delete",
                        context: context,
                        escapeQuotes: Boolean(insideDoWhen),
                        allow: { parentNode: refNode_1, varName: _varName },
                    });
                    if (authAndParams[0]) {
                        var quote = insideDoWhen ? "\\\"" : "\"";
                        res.strs.push("WITH " + __spread(withVars, [_varName]).join(", "));
                        res.strs.push("CALL apoc.util.validate(NOT(" + authAndParams[0] + "), " + quote + constants_1.AUTH_FORBIDDEN_ERROR + quote + ", [0])");
                        res.params = __assign(__assign({}, res.params), authAndParams[1]);
                    }
                }
                if (d.delete) {
                    var deleteAndParams = createDeleteAndParams({
                        context: context,
                        node: refNode_1,
                        deleteInput: d.delete,
                        varName: _varName,
                        withVars: __spread(withVars, [_varName]),
                        parentVar: _varName,
                    });
                    res.strs.push(deleteAndParams[0]);
                    res.params = __assign(__assign({}, res.params), deleteAndParams[1]);
                }
                res.strs.push("\n                    FOREACH(_ IN CASE " + _varName + " WHEN NULL THEN [] ELSE [1] END |\n                        DETACH DELETE " + _varName + "\n                    )");
            });
            return res;
        }
        return res;
    }
    var _b = Object.entries(deleteInput).reduce(reducer, { strs: [], params: {} }), strs = _b.strs, params = _b.params;
    return [strs.join("\n"), params];
}
exports.default = createDeleteAndParams;
//# sourceMappingURL=create-delete-and-params.js.map