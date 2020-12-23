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
function createAuthAndParams(_a) {
    var _b;
    var varName = _a.varName, node = _a.node, chainStr = _a.chainStr, context = _a.context, functionType = _a.functionType, recurseArray = _a.recurseArray, operation = _a.operation, chainStrOverRide = _a.chainStrOverRide, type = _a.type;
    var rules = (((_b = node === null || node === void 0 ? void 0 : node.auth) === null || _b === void 0 ? void 0 : _b.rules) || []).filter(function (r) { var _a; return ((_a = r.operations) === null || _a === void 0 ? void 0 : _a.includes(operation)) && r[type] && r.isAuthenticated !== false; });
    if (rules.filter(function (x) { return x[type] === "*"; }).length) {
        return ["", {}];
    }
    function reducer(res, ruleValue, index) {
        var param = "";
        if (chainStr && !chainStrOverRide) {
            param = chainStr;
        }
        else if (chainStrOverRide) {
            param = "" + chainStrOverRide + index;
        }
        else {
            param = varName + "_auth" + index;
        }
        Object.entries(ruleValue).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            switch (key) {
                case "AND":
                case "OR":
                    {
                        var inner_1 = [];
                        value.forEach(function (v, i) {
                            var _a;
                            var recurse = createAuthAndParams({
                                recurseArray: [(_a = {}, _a[type] = v, _a)],
                                varName: varName,
                                node: node,
                                chainStr: param + "_" + key + i,
                                context: context,
                                operation: operation,
                                type: type,
                            });
                            inner_1.push(recurse[0]
                                .replace("CALL apoc.util.validate(NOT(", "")
                                .replace("), \"Forbidden\", [0])", ""));
                            res.params = __assign(__assign({}, res.params), recurse[1]);
                        });
                        res.strs.push("(" + inner_1.join(" " + key + " ") + ")");
                    }
                    break;
                default: {
                    if (typeof value === "string") {
                        var _param = param + "_" + key;
                        res.strs.push(varName + "." + key + " = $" + _param);
                        var jwt = context.getJWT();
                        if (!jwt) {
                            throw new Error("Unauthorized");
                        }
                        res.params[_param] = jwt[value];
                    }
                    var relationField_1 = node.relationFields.find(function (x) { return key === x.fieldName; });
                    if (relationField_1) {
                        var refNode_1 = context.neoSchema.nodes.find(function (x) { return x.name === relationField_1.typeMeta.name; });
                        var inStr = relationField_1.direction === "IN" ? "<-" : "-";
                        var outStr = relationField_1.direction === "OUT" ? "->" : "-";
                        var relTypeStr = "[:" + relationField_1.type + "]";
                        var relationVarName_1 = relationField_1.fieldName;
                        var resultStr_1 = [
                            "EXISTS((" + varName + ")" + inStr + relTypeStr + outStr + "(:" + relationField_1.typeMeta.name + "))",
                            "AND " + (type === "bind" ? "ALL" : "ANY") + "(" + relationVarName_1 + " IN [(" + varName + ")" + inStr + relTypeStr + outStr + "(" + relationVarName_1 + ":" + relationField_1.typeMeta.name + ") | " + relationVarName_1 + "] WHERE ",
                        ].join(" ");
                        Object.entries(value).forEach(function (_a) {
                            var _b, _c;
                            var _d = __read(_a, 2), k = _d[0], v = _d[1];
                            var recurse = createAuthAndParams({
                                node: refNode_1,
                                context: context,
                                chainStr: param + "_" + key,
                                varName: relationVarName_1,
                                recurseArray: [(_b = {}, _b[type] = (_c = {}, _c[k] = v, _c), _b)],
                                operation: operation,
                                type: type,
                            });
                            resultStr_1 += recurse[0]
                                .replace("CALL apoc.util.validate(NOT(", "")
                                .replace("), \"Forbidden\", [0])", "");
                            resultStr_1 += ")"; // close ALL
                            res.params = __assign(__assign({}, res.params), recurse[1]);
                            res.strs.push(resultStr_1);
                        });
                    }
                }
            }
        });
        return res;
    }
    var _c = (recurseArray || rules).reduce(function (res, value, i) { return reducer(res, value[type], i); }, {
        strs: [],
        params: {},
    }), strs = _c.strs, params = _c.params;
    var auth = strs.length ? "CALL apoc.util.validate(NOT(" + strs.join(" AND ") + "), \"Forbidden\", [0])" : "";
    if (functionType) {
        return [auth.replace(/CALL/g, "").replace(/apoc.util.validate/g, "apoc.util.validatePredicate"), params];
    }
    return [auth, params];
}
exports.default = createAuthAndParams;
//# sourceMappingURL=create-auth-and-params.js.map