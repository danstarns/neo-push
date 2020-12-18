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
function createWhereAndParams(_a) {
    var whereInput = _a.whereInput, varName = _a.varName, chainStr = _a.chainStr, node = _a.node, context = _a.context, recursing = _a.recursing, chainStrOverRide = _a.chainStrOverRide;
    if (!Object.keys(whereInput).length) {
        return ["", {}];
    }
    function reducer(res, _a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        var param = "";
        if (chainStr) {
            param = chainStr + "_" + key;
        }
        else if (chainStrOverRide) {
            param = chainStrOverRide + "_" + key;
        }
        else {
            param = varName + "_" + key;
        }
        if (key.endsWith("_NOT")) {
            var _c = __read(key.split("_NOT"), 1), fieldName_1 = _c[0];
            var relationField_1 = node.relationFields.find(function (x) { return fieldName_1 === x.fieldName; });
            if (relationField_1) {
                var refNode = context.neoSchema.nodes.find(function (x) { return x.name === relationField_1.typeMeta.name; });
                var inStr = relationField_1.direction === "IN" ? "<-" : "-";
                var outStr = relationField_1.direction === "OUT" ? "->" : "-";
                var relTypeStr = "[:" + relationField_1.type + "]";
                var resultStr = [
                    "EXISTS((" + varName + ")" + inStr + relTypeStr + outStr + "(:" + relationField_1.typeMeta.name + "))",
                    "AND NONE(" + param + " IN [(" + varName + ")" + inStr + relTypeStr + outStr + "(" + param + ":" + relationField_1.typeMeta.name + ") | " + param + "] INNER_WHERE ",
                ].join(" ");
                var recurse = createWhereAndParams({
                    whereInput: value,
                    varName: param,
                    chainStr: param,
                    node: refNode,
                    context: context,
                    recursing: true,
                });
                resultStr += recurse[0];
                resultStr += ")"; // close ALL
                res.clauses.push(resultStr);
                res.params = __assign(__assign({}, res.params), recurse[1]);
            }
            else {
                res.clauses.push("(NOT " + varName + "." + fieldName_1 + " = $" + param + ")");
                res.params[param] = value;
            }
            return res;
        }
        if (key.endsWith("_NOT_IN")) {
            var _d = __read(key.split("_NOT_IN"), 1), fieldName_2 = _d[0];
            var relationField_2 = node.relationFields.find(function (x) { return fieldName_2 === x.fieldName; });
            if (relationField_2) {
                var refNode_1 = context.neoSchema.nodes.find(function (x) { return x.name === relationField_2.typeMeta.name; });
                var inStr = relationField_2.direction === "IN" ? "<-" : "-";
                var outStr = relationField_2.direction === "OUT" ? "->" : "-";
                var relTypeStr = "[:" + relationField_2.type + "]";
                var resultStr = [
                    "EXISTS((" + varName + ")" + inStr + relTypeStr + outStr + "(:" + relationField_2.typeMeta.name + "))",
                    "AND ALL(" + param + " IN [(" + varName + ")" + inStr + relTypeStr + outStr + "(" + param + ":" + relationField_2.typeMeta.name + ") | " + param + "] INNER_WHERE NOT(",
                ].join(" ");
                var inner_1 = [];
                value.forEach(function (v, i) {
                    var recurse = createWhereAndParams({
                        whereInput: v,
                        varName: param,
                        chainStr: "" + param + i,
                        node: refNode_1,
                        context: context,
                        recursing: true,
                    });
                    inner_1.push(recurse[0]);
                    res.params = __assign(__assign({}, res.params), recurse[1]);
                });
                resultStr += inner_1.join(" OR ");
                resultStr += ")"; // close NOT
                resultStr += ")"; // close ALL
                res.clauses.push(resultStr);
            }
            else {
                res.clauses.push("(NOT " + varName + "." + fieldName_2 + " IN $" + param + ")");
                res.params[param] = value;
            }
            return res;
        }
        if (key.endsWith("_IN")) {
            var _e = __read(key.split("_IN"), 1), fieldName_3 = _e[0];
            var relationField_3 = node.relationFields.find(function (x) { return fieldName_3 === x.fieldName; });
            if (relationField_3) {
                var refNode_2 = context.neoSchema.nodes.find(function (x) { return x.name === relationField_3.typeMeta.name; });
                var inStr = relationField_3.direction === "IN" ? "<-" : "-";
                var outStr = relationField_3.direction === "OUT" ? "->" : "-";
                var relTypeStr = "[:" + relationField_3.type + "]";
                var resultStr = [
                    "EXISTS((" + varName + ")" + inStr + relTypeStr + outStr + "(:" + relationField_3.typeMeta.name + "))",
                    "AND ALL(" + param + " IN [(" + varName + ")" + inStr + relTypeStr + outStr + "(" + param + ":" + relationField_3.typeMeta.name + ") | " + param + "] INNER_WHERE ",
                ].join(" ");
                var inner_2 = [];
                value.forEach(function (v, i) {
                    var recurse = createWhereAndParams({
                        whereInput: v,
                        varName: param,
                        chainStr: "" + param + i,
                        node: refNode_2,
                        context: context,
                        recursing: true,
                    });
                    inner_2.push(recurse[0]);
                    res.params = __assign(__assign({}, res.params), recurse[1]);
                });
                resultStr += inner_2.join(" OR ");
                resultStr += ")"; // close ALL
                res.clauses.push(resultStr);
            }
            else {
                res.clauses.push(varName + "." + fieldName_3 + " IN $" + param);
                res.params[param] = value;
            }
            return res;
        }
        var equalityRelation = node.relationFields.find(function (x) { return key === x.fieldName; });
        if (equalityRelation) {
            var refNode = context.neoSchema.nodes.find(function (x) { return x.name === equalityRelation.typeMeta.name; });
            var inStr = equalityRelation.direction === "IN" ? "<-" : "-";
            var outStr = equalityRelation.direction === "OUT" ? "->" : "-";
            var relTypeStr = "[:" + equalityRelation.type + "]";
            var resultStr = [
                "EXISTS((" + varName + ")" + inStr + relTypeStr + outStr + "(:" + equalityRelation.typeMeta.name + "))",
                "AND ALL(" + param + " IN [(" + varName + ")" + inStr + relTypeStr + outStr + "(" + param + ":" + equalityRelation.typeMeta.name + ") | " + param + "] INNER_WHERE ",
            ].join(" ");
            var recurse = createWhereAndParams({
                whereInput: value,
                varName: param,
                chainStr: param,
                node: refNode,
                context: context,
                recursing: true,
            });
            resultStr += recurse[0];
            resultStr += ")"; // close ALL
            res.clauses.push(resultStr);
            res.params = __assign(__assign({}, res.params), recurse[1]);
            return res;
        }
        if (key.endsWith("_REGEX")) {
            var _f = __read(key.split("_REGEX"), 1), fieldName = _f[0];
            res.clauses.push(varName + "." + fieldName + " =~ $" + param);
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_NOT_CONTAINS")) {
            var _g = __read(key.split("_NOT_CONTAINS"), 1), fieldName = _g[0];
            res.clauses.push("(NOT " + varName + "." + fieldName + " CONTAINS $" + param + ")");
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_CONTAINS")) {
            var _h = __read(key.split("_CONTAINS"), 1), fieldName = _h[0];
            res.clauses.push(varName + "." + fieldName + " CONTAINS $" + param);
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_NOT_STARTS_WITH")) {
            var _j = __read(key.split("_NOT_STARTS_WITH"), 1), fieldName = _j[0];
            res.clauses.push("(NOT " + varName + "." + fieldName + " STARTS WITH $" + param + ")");
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_STARTS_WITH")) {
            var _k = __read(key.split("_STARTS_WITH"), 1), fieldName = _k[0];
            res.clauses.push(varName + "." + fieldName + " STARTS WITH $" + param);
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_NOT_ENDS_WITH")) {
            var _l = __read(key.split("_NOT_ENDS_WITH"), 1), fieldName = _l[0];
            res.clauses.push("(NOT " + varName + "." + fieldName + " ENDS WITH $" + param + ")");
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_ENDS_WITH")) {
            var _m = __read(key.split("_ENDS_WITH"), 1), fieldName = _m[0];
            res.clauses.push(varName + "." + fieldName + " ENDS WITH $" + param);
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_LT")) {
            var _o = __read(key.split("_LT"), 1), fieldName = _o[0];
            res.clauses.push(varName + "." + fieldName + " < $" + param);
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_LTE")) {
            var _p = __read(key.split("_LTE"), 1), fieldName = _p[0];
            res.clauses.push(varName + "." + fieldName + " <= $" + param);
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_GT")) {
            var _q = __read(key.split("_GT"), 1), fieldName = _q[0];
            res.clauses.push(varName + "." + fieldName + " > $" + param);
            res.params[param] = value;
            return res;
        }
        if (key.endsWith("_GTE")) {
            var _r = __read(key.split("_GTE"), 1), fieldName = _r[0];
            res.clauses.push(varName + "." + fieldName + " >= $" + param);
            res.params[param] = value;
            return res;
        }
        if (["AND", "OR"].includes(key)) {
            var innerClauses_1 = [];
            value.forEach(function (v, i) {
                var recurse = createWhereAndParams({
                    whereInput: v,
                    varName: varName,
                    chainStr: "" + param + (i > 0 ? i : ""),
                    node: node,
                    context: context,
                    recursing: true,
                });
                innerClauses_1.push("" + recurse[0]);
                res.params = __assign(__assign({}, res.params), recurse[1]);
            });
            res.clauses.push("(" + innerClauses_1.join(" " + key + " ") + ")");
            return res;
        }
        res.clauses.push(varName + "." + key + " = $" + param);
        res.params[param] = value;
        return res;
    }
    var _b = Object.entries(whereInput).reduce(reducer, { clauses: [], params: {} }), clauses = _b.clauses, params = _b.params;
    var where = "" + (!recursing ? "WHERE " : "");
    where += clauses.join(" AND ").replace(/INNER_WHERE/gi, "WHERE");
    return [where, params];
}
exports.default = createWhereAndParams;
//# sourceMappingURL=create-where-and-params.js.map