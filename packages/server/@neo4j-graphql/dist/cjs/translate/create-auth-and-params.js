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
var dot_prop_1 = __importDefault(require("dot-prop"));
var constants_1 = require("../constants");
function createRolesStr(_a) {
    var roles = _a.roles, escapeQuotes = _a.escapeQuotes;
    var quote = escapeQuotes ? "\\\"" : "\"";
    var joined = roles.map(function (r) { return "" + quote + r + quote; }).join(", ");
    return "ANY(r IN [" + joined + "] WHERE ANY(rr IN $auth.roles WHERE r = rr))";
}
function createAuthPredicate(_a) {
    var rule = _a.rule, node = _a.node, varName = _a.varName, context = _a.context, chainStr = _a.chainStr, kind = _a.kind;
    var allowOrBind = rule[kind];
    if (!allowOrBind) {
        return ["", {}];
    }
    var result = Object.entries(allowOrBind).reduce(function (res, _a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        if (key === "AND" || key === "OR") {
            var inner_1 = [];
            value.forEach(function (v, i) {
                var _a;
                var authPredicate = createAuthPredicate({
                    rule: (_a = {}, _a[kind] = v, _a),
                    varName: varName,
                    node: node,
                    chainStr: chainStr + "_" + key + i,
                    context: context,
                    kind: kind,
                });
                inner_1.push(authPredicate[0]);
                res.params = __assign(__assign({}, res.params), authPredicate[1]);
            });
            res.strs.push("(" + inner_1.join(" " + key + " ") + ")");
        }
        var authableField = node.authableFields.find(function (field) { return field.fieldName === key; });
        if (authableField) {
            var jwt = context.getJWTSafe();
            var _param = chainStr + "_" + key;
            var _c = __read(value.split("$jwt."), 2), propertyPath = _c[1];
            if (propertyPath) {
                res.params[_param] = dot_prop_1.default.get({ value: jwt }, "value." + propertyPath);
                res.strs.push(varName + "." + key + " = $" + _param);
            }
        }
        var relationField = node.relationFields.find(function (x) { return key === x.fieldName; });
        if (relationField) {
            var refNode_1 = context.neoSchema.nodes.find(function (x) { return x.name === relationField.typeMeta.name; });
            var inStr = relationField.direction === "IN" ? "<-" : "-";
            var outStr = relationField.direction === "OUT" ? "->" : "-";
            var relTypeStr = "[:" + relationField.type + "]";
            var relationVarName_1 = relationField.fieldName;
            var resultStr_1 = [
                "EXISTS((" + varName + ")" + inStr + relTypeStr + outStr + "(:" + relationField.typeMeta.name + "))",
                "AND " + (kind === "allow" ? "ANY" : "ALL") + "(" + relationVarName_1 + " IN [(" + varName + ")" + inStr + relTypeStr + outStr + "(" + relationVarName_1 + ":" + relationField.typeMeta.name + ") | " + relationVarName_1 + "] WHERE ",
            ].join(" ");
            Object.entries(value).forEach(function (_a) {
                var _b, _c;
                var _d = __read(_a, 2), k = _d[0], v = _d[1];
                var authPredicate = createAuthPredicate({
                    node: refNode_1,
                    context: context,
                    chainStr: chainStr + "_" + key,
                    varName: relationVarName_1,
                    rule: (_b = {}, _b[kind] = (_c = {}, _c[k] = v, _c), _b),
                    kind: kind,
                });
                resultStr_1 += authPredicate[0];
                resultStr_1 += ")"; // close ALL
                res.params = __assign(__assign({}, res.params), authPredicate[1]);
                res.strs.push(resultStr_1);
            });
        }
        return res;
    }, { params: {}, strs: [] });
    return [result.strs.join(" AND "), result.params];
}
function createAuthAndParams(_a) {
    var entity = _a.entity, operation = _a.operation, skipRoles = _a.skipRoles, skipIsAuthenticated = _a.skipIsAuthenticated, allow = _a.allow, context = _a.context, escapeQuotes = _a.escapeQuotes, bind = _a.bind;
    if (!entity.auth) {
        return ["", {}];
    }
    var authRules = [];
    if (operation) {
        authRules = entity === null || entity === void 0 ? void 0 : entity.auth.rules.filter(function (r) { var _a; return r.operations === "*" || ((_a = r.operations) === null || _a === void 0 ? void 0 : _a.includes(operation)); });
    }
    else {
        authRules = entity === null || entity === void 0 ? void 0 : entity.auth.rules;
    }
    function createSubPredicate(_a) {
        var authRule = _a.authRule, index = _a.index, chainStr = _a.chainStr;
        var thisPredicates = [];
        var thisParams = {};
        if (!skipRoles && authRule.roles) {
            thisPredicates.push(createRolesStr({ roles: authRule.roles, escapeQuotes: escapeQuotes }));
        }
        if (!skipIsAuthenticated && (authRule.isAuthenticated === true || authRule.isAuthenticated === false)) {
            thisPredicates.push("apoc.util.validatePredicate(NOT($auth.isAuthenticated = " + Boolean(authRule.isAuthenticated) + "), \"" + constants_1.AUTH_UNAUTHENTICATED_ERROR + "\", [0])");
        }
        if (allow && authRule.allow) {
            var allowAndParams = createAuthPredicate({
                context: context,
                node: allow.parentNode,
                varName: allow.varName,
                rule: authRule,
                chainStr: "" + (allow.chainStr || allow.varName) + (chainStr || "") + "_auth_allow" + index,
                kind: "allow",
            });
            if (allowAndParams[0]) {
                thisPredicates.push(allowAndParams[0]);
                thisParams = __assign(__assign({}, thisParams), allowAndParams[1]);
            }
        }
        ["AND", "OR"].forEach(function (key) {
            var value = authRule[key];
            if (!value) {
                return;
            }
            var predicates = [];
            var predicateParams = {};
            value.forEach(function (v, i) {
                var _a = __read(createSubPredicate({
                    authRule: v,
                    index: i,
                    chainStr: chainStr ? "" + chainStr + key + i : "" + key + i,
                }), 2), str = _a[0], par = _a[1];
                if (!str) {
                    return;
                }
                predicates.push(str);
                predicateParams = __assign(__assign({}, predicateParams), par);
            });
            thisPredicates.push(predicates.join(" " + key + " "));
            thisParams = __assign(__assign({}, thisParams), predicateParams);
        });
        if (bind && authRule.bind) {
            var allowAndParams = createAuthPredicate({
                context: context,
                node: bind.parentNode,
                varName: bind.varName,
                rule: authRule,
                chainStr: "" + (bind.chainStr || bind.varName) + (chainStr || "") + "_auth_bind" + index,
                kind: "bind",
            });
            if (allowAndParams[0]) {
                thisPredicates.push(allowAndParams[0]);
                thisParams = __assign(__assign({}, thisParams), allowAndParams[1]);
            }
        }
        return [thisPredicates.join(" AND "), thisParams];
    }
    var subPredicates = authRules.reduce(function (res, authRule, index) {
        var _a = __read(createSubPredicate({ authRule: authRule, index: index }), 2), str = _a[0], par = _a[1];
        return {
            strs: __spread(res.strs, [str]),
            params: __assign(__assign({}, res.params), par),
        };
    }, { strs: [], params: {} });
    return [subPredicates.strs.filter(Boolean).join(" OR "), subPredicates.params];
}
exports.default = createAuthAndParams;
//# sourceMappingURL=create-auth-and-params.js.map