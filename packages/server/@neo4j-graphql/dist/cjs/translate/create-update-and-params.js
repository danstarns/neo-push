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
var create_connect_and_params_1 = __importDefault(require("./create-connect-and-params"));
var create_disconnect_and_params_1 = __importDefault(require("./create-disconnect-and-params"));
var create_where_and_params_1 = __importDefault(require("./create-where-and-params"));
var create_create_and_params_1 = __importDefault(require("./create-create-and-params"));
var constants_1 = require("../constants");
var create_delete_and_params_1 = __importDefault(require("./create-delete-and-params"));
var create_auth_param_1 = __importDefault(require("./create-auth-param"));
var create_auth_and_params_1 = __importDefault(require("./create-auth-and-params"));
function createUpdateAndParams(_a) {
    var updateInput = _a.updateInput, varName = _a.varName, node = _a.node, parentVar = _a.parentVar, chainStr = _a.chainStr, insideDoWhen = _a.insideDoWhen, withVars = _a.withVars, context = _a.context;
    var hasAppliedTimeStamps = false;
    function reducer(res, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        var param;
        if (chainStr) {
            param = chainStr + "_" + key;
        }
        else {
            param = parentVar + "_update_" + key;
        }
        var relationField = node.relationFields.find(function (x) { return key.startsWith(x.fieldName); });
        var pointField = node.pointFields.find(function (x) { return key.startsWith(x.fieldName); });
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
            var updates = relationField.typeMeta.array ? value : [value];
            updates.forEach(function (update, index) {
                var _a;
                var _varName = varName + "_" + key + index;
                if (update.update) {
                    if (withVars) {
                        res.strs.push("WITH " + withVars.join(", "));
                    }
                    res.strs.push("OPTIONAL MATCH (" + parentVar + ")" + inStr_1 + relTypeStr_1 + outStr_1 + "(" + _varName + ":" + refNode_1.name + ")");
                    if (update.where) {
                        var whereAndParams = create_where_and_params_1.default({
                            varName: _varName,
                            whereInput: update.where,
                            node: refNode_1,
                            context: context,
                        });
                        res.strs.push(whereAndParams[0]);
                        res.params = __assign(__assign({}, res.params), whereAndParams[1]);
                    }
                    res.strs.push("CALL apoc.do.when(" + _varName + " IS NOT NULL, " + (insideDoWhen ? '\\"' : '"'));
                    var auth = create_auth_param_1.default({ context: context });
                    var innerApocParams = { auth: auth };
                    var updateAndParams = createUpdateAndParams({
                        context: context,
                        node: refNode_1,
                        updateInput: update.update,
                        varName: _varName,
                        withVars: __spread(withVars, [_varName]),
                        parentVar: _varName,
                        chainStr: "" + param + index,
                        insideDoWhen: true,
                    });
                    res.params = __assign(__assign(__assign({}, res.params), updateAndParams[1]), { auth: auth });
                    innerApocParams = __assign(__assign({}, innerApocParams), updateAndParams[1]);
                    var updateStrs = [updateAndParams[0], "RETURN count(*)"];
                    var apocArgs = "{" + parentVar + ":" + parentVar + ", " + _varName + ":" + _varName + "REPLACE_ME}";
                    if (insideDoWhen) {
                        updateStrs.push("\\\", \\\"\\\", " + apocArgs + ")");
                    }
                    else {
                        updateStrs.push("\", \"\", " + apocArgs + ")");
                    }
                    updateStrs.push("YIELD value as _");
                    var paramsString = Object.keys(innerApocParams).reduce(function (r, k) { return __spread(r, [k + ":$" + k]); }, []).join(",");
                    var updateStr = updateStrs.join("\n").replace(/REPLACE_ME/g, ", " + paramsString);
                    res.strs.push(updateStr);
                }
                if (update.disconnect) {
                    var disconnectAndParams = create_disconnect_and_params_1.default({
                        context: context,
                        refNode: refNode_1,
                        value: update.disconnect,
                        varName: _varName + "_disconnect",
                        withVars: withVars,
                        parentVar: parentVar,
                        relationField: relationField,
                        labelOverride: unionTypeName,
                        parentNode: node,
                        insideDoWhen: insideDoWhen,
                    });
                    res.strs.push(disconnectAndParams[0]);
                    res.params = __assign(__assign({}, res.params), disconnectAndParams[1]);
                }
                if (update.connect) {
                    var connectAndParams = create_connect_and_params_1.default({
                        context: context,
                        refNode: refNode_1,
                        value: update.connect,
                        varName: _varName + "_connect",
                        withVars: withVars,
                        parentVar: parentVar,
                        relationField: relationField,
                        labelOverride: unionTypeName,
                        parentNode: node,
                        insideDoWhen: insideDoWhen,
                    });
                    res.strs.push(connectAndParams[0]);
                    res.params = __assign(__assign({}, res.params), connectAndParams[1]);
                }
                if (update.delete) {
                    var innerVarName = _varName + "_delete";
                    var deleteAndParams = create_delete_and_params_1.default({
                        context: context,
                        node: node,
                        deleteInput: (_a = {}, _a[key] = update.delete, _a),
                        varName: innerVarName,
                        chainStr: innerVarName,
                        parentVar: parentVar,
                        withVars: withVars,
                        insideDoWhen: insideDoWhen,
                    });
                    res.strs.push(deleteAndParams[0]);
                    res.params = __assign(__assign({}, res.params), deleteAndParams[1]);
                }
                if (update.create) {
                    if (withVars) {
                        res.strs.push("WITH " + withVars.join(", "));
                    }
                    var creates = relationField.typeMeta.array ? update.create : [update.create];
                    creates.forEach(function (create, i) {
                        var innerVarName = _varName + "_create" + i;
                        var createAndParams = create_create_and_params_1.default({
                            context: context,
                            node: refNode_1,
                            input: create,
                            varName: innerVarName,
                            withVars: __spread(withVars, [innerVarName]),
                            insideDoWhen: insideDoWhen,
                        });
                        res.strs.push(createAndParams[0]);
                        res.params = __assign(__assign({}, res.params), createAndParams[1]);
                        res.strs.push("MERGE (" + parentVar + ")" + inStr_1 + relTypeStr_1 + outStr_1 + "(" + innerVarName + ")");
                    });
                }
            });
            return res;
        }
        if (!hasAppliedTimeStamps) {
            var timestamps = node.dateTimeFields.filter(function (x) { return x.timestamps && x.timestamps.includes("update"); });
            timestamps.forEach(function (ts) {
                res.strs.push("SET " + varName + "." + ts.fieldName + " = datetime()");
            });
            hasAppliedTimeStamps = true;
        }
        var settableField = node.mutableFields.find(function (x) { return x.fieldName === key; });
        var authableField = node.authableFields.find(function (x) { return x.fieldName === key; });
        if (settableField) {
            if (pointField) {
                if (pointField.typeMeta.array) {
                    res.strs.push("SET " + varName + "." + key + " = [p in $" + param + " | point(p)]");
                }
                else {
                    res.strs.push("SET " + varName + "." + key + " = point($" + param + ")");
                }
            }
            else {
                res.strs.push("SET " + varName + "." + key + " = $" + param);
            }
            res.params[param] = value;
        }
        if (authableField) {
            if (authableField.auth) {
                var preAuth_1 = create_auth_and_params_1.default({
                    entity: authableField,
                    operation: "update",
                    context: context,
                    allow: { varName: varName, parentNode: node, chainStr: param },
                    escapeQuotes: Boolean(insideDoWhen),
                });
                var postAuth_1 = create_auth_and_params_1.default({
                    entity: authableField,
                    operation: "update",
                    skipRoles: true,
                    skipIsAuthenticated: true,
                    context: context,
                    bind: { parentNode: node, varName: varName, chainStr: param },
                    escapeQuotes: Boolean(insideDoWhen),
                });
                if (!res.meta) {
                    res.meta = { preAuthStrs: [], postAuthStrs: [] };
                }
                if (preAuth_1[0]) {
                    res.meta.preAuthStrs.push(preAuth_1[0]);
                    res.params = __assign(__assign({}, res.params), preAuth_1[1]);
                }
                if (postAuth_1[0]) {
                    res.meta.postAuthStrs.push(postAuth_1[0]);
                    res.params = __assign(__assign({}, res.params), postAuth_1[1]);
                }
            }
        }
        return res;
    }
    // eslint-disable-next-line prefer-const
    var _b = Object.entries(updateInput).reduce(reducer, {
        strs: [],
        params: {},
    }), strs = _b.strs, params = _b.params, _c = _b.meta, meta = _c === void 0 ? { preAuthStrs: [], postAuthStrs: [] } : _c;
    var preAuthStrs = [];
    var postAuthStrs = [];
    var withStr = "WITH " + withVars.join(", ");
    var preAuth = create_auth_and_params_1.default({
        entity: node,
        context: context,
        allow: { parentNode: node, varName: varName },
        operation: "update",
        escapeQuotes: Boolean(insideDoWhen),
    });
    if (preAuth[0]) {
        preAuthStrs.push(preAuth[0]);
        params = __assign(__assign({}, params), preAuth[1]);
    }
    var postAuth = create_auth_and_params_1.default({
        entity: node,
        context: context,
        skipIsAuthenticated: true,
        skipRoles: true,
        operation: "update",
        bind: { parentNode: node, varName: varName },
        escapeQuotes: Boolean(insideDoWhen),
    });
    if (postAuth[0]) {
        postAuthStrs.push(postAuth[0]);
        params = __assign(__assign({}, params), postAuth[1]);
    }
    if (meta) {
        preAuthStrs = __spread(preAuthStrs, meta.preAuthStrs);
        postAuthStrs = __spread(postAuthStrs, meta.postAuthStrs);
    }
    var preAuthStr = "";
    var postAuthStr = "";
    var forbiddenString = insideDoWhen ? "\\\"" + constants_1.AUTH_FORBIDDEN_ERROR + "\\\"" : "\"" + constants_1.AUTH_FORBIDDEN_ERROR + "\"";
    if (preAuthStrs.length) {
        var apocStr = "CALL apoc.util.validate(NOT(" + preAuthStrs.join(" AND ") + "), " + forbiddenString + ", [0])";
        preAuthStr = withStr + "\n" + apocStr;
    }
    if (postAuthStrs.length) {
        var apocStr = "CALL apoc.util.validate(NOT(" + postAuthStrs.join(" AND ") + "), " + forbiddenString + ", [0])";
        postAuthStr = withStr + "\n" + apocStr;
    }
    var str = preAuthStr + "\n" + strs.join("\n") + "\n" + postAuthStr;
    return [str, params];
}
exports.default = createUpdateAndParams;
//# sourceMappingURL=create-update-and-params.js.map