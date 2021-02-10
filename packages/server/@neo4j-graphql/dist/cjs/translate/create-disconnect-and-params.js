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
function createDisconnectAndParams(_a) {
    var withVars = _a.withVars, value = _a.value, varName = _a.varName, relationField = _a.relationField, parentVar = _a.parentVar, refNode = _a.refNode, context = _a.context, labelOverride = _a.labelOverride, parentNode = _a.parentNode, insideDoWhen = _a.insideDoWhen;
    function reducer(res, disconnect, index) {
        var _varName = "" + varName + index;
        var inStr = relationField.direction === "IN" ? "<-" : "-";
        var outStr = relationField.direction === "OUT" ? "->" : "-";
        var relVarName = _varName + "_rel";
        var relTypeStr = "[" + relVarName + ":" + relationField.type + "]";
        res.disconnects.push("WITH " + withVars.join(", "));
        res.disconnects.push("OPTIONAL MATCH (" + parentVar + ")" + inStr + relTypeStr + outStr + "(" + _varName + ":" + (labelOverride || relationField.typeMeta.name) + ")");
        if (disconnect.where) {
            var where = create_where_and_params_1.default({
                varName: _varName,
                whereInput: disconnect.where,
                node: refNode,
                context: context,
            });
            res.disconnects.push(where[0]);
            res.params = __assign(__assign({}, res.params), where[1]);
        }
        var preAuth = [parentNode, refNode].reduce(function (result, node, i) {
            if (!node.auth) {
                return result;
            }
            var _a = __read(create_auth_and_params_1.default({
                entity: node,
                operation: "disconnect",
                context: context,
                escapeQuotes: Boolean(insideDoWhen),
                allow: { parentNode: node, varName: _varName, chainStr: "" + _varName + node.name + i + "_allow" },
            }), 2), str = _a[0], params = _a[1];
            if (!str) {
                return result;
            }
            result.disconnects.push(str);
            result.params = __assign(__assign({}, result.params), params);
            return result;
        }, { disconnects: [], params: {} });
        if (preAuth.disconnects.length) {
            var quote = insideDoWhen ? "\\\"" : "\"";
            res.disconnects.push("WITH " + __spread(withVars, [_varName, relVarName]).join(", "));
            res.disconnects.push("CALL apoc.util.validate(NOT(" + preAuth.disconnects.join(" AND ") + "), " + quote + constants_1.AUTH_FORBIDDEN_ERROR + quote + ", [0])");
            res.params = __assign(__assign({}, res.params), preAuth.params);
        }
        /*
           Replace with subclauses https://neo4j.com/developer/kb/conditional-cypher-execution/
           https://neo4j.slack.com/archives/C02PUHA7C/p1603458561099100
        */
        res.disconnects.push("FOREACH(_ IN CASE " + _varName + " WHEN NULL THEN [] ELSE [1] END | ");
        res.disconnects.push("DELETE " + _varName + "_rel");
        res.disconnects.push(")"); // close FOREACH
        if (disconnect.disconnect) {
            var disconnects_1 = (Array.isArray(disconnect.disconnect)
                ? disconnect.disconnect
                : [disconnect.disconnect]);
            disconnects_1.forEach(function (c) {
                var reduced = Object.entries(c).reduce(function (r, _a) {
                    var _b = __read(_a, 2), k = _b[0], v = _b[1];
                    var relField = refNode.relationFields.find(function (x) { return k.startsWith(x.fieldName); });
                    var newRefNode;
                    if (relationField.union) {
                        var _c = __read(k.split(relationField.fieldName + "_").join("").split("_"), 1), modelName_1 = _c[0];
                        newRefNode = context.neoSchema.nodes.find(function (x) { return x.name === modelName_1; });
                    }
                    else {
                        newRefNode = context.neoSchema.nodes.find(function (x) { return x.name === relField.typeMeta.name; });
                    }
                    var recurse = createDisconnectAndParams({
                        withVars: __spread(withVars, [_varName]),
                        value: v,
                        varName: _varName + "_" + k,
                        relationField: relField,
                        parentVar: _varName,
                        context: context,
                        refNode: newRefNode,
                        parentNode: refNode,
                    });
                    r.disconnects.push(recurse[0]);
                    r.params = __assign(__assign({}, r.params), recurse[1]);
                    return r;
                }, { disconnects: [], params: {} });
                res.disconnects.push(reduced.disconnects.join("\n"));
                res.params = __assign(__assign({}, res.params), reduced.params);
            });
        }
        var postAuth = [parentNode, refNode].reduce(function (result, node, i) {
            if (!node.auth) {
                return result;
            }
            var _a = __read(create_auth_and_params_1.default({
                entity: node,
                operation: "disconnect",
                context: context,
                escapeQuotes: Boolean(insideDoWhen),
                skipRoles: true,
                skipIsAuthenticated: true,
                bind: { parentNode: node, varName: _varName, chainStr: "" + _varName + node.name + i + "_bind" },
            }), 2), str = _a[0], params = _a[1];
            if (!str) {
                return result;
            }
            result.disconnects.push(str);
            result.params = __assign(__assign({}, result.params), params);
            return result;
        }, { disconnects: [], params: {} });
        if (postAuth.disconnects.length) {
            var quote = insideDoWhen ? "\\\"" : "\"";
            res.disconnects.push("WITH " + __spread(withVars, [_varName]).join(", "));
            res.disconnects.push("CALL apoc.util.validate(NOT(" + postAuth.disconnects.join(" AND ") + "), " + quote + constants_1.AUTH_FORBIDDEN_ERROR + quote + ", [0])");
            res.params = __assign(__assign({}, res.params), postAuth.params);
        }
        return res;
    }
    var _b = (relationField.typeMeta.array ? value : [value]).reduce(reducer, {
        disconnects: [],
        params: {},
    }), disconnects = _b.disconnects, params = _b.params;
    return [disconnects.join("\n"), params];
}
exports.default = createDisconnectAndParams;
//# sourceMappingURL=create-disconnect-and-params.js.map