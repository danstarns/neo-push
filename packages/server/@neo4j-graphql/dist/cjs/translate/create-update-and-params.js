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
var create_auth_and_params_1 = __importDefault(require("./create-auth-and-params"));
var auth_1 = require("../auth");
function createUpdateAndParams(_a) {
    var updateInput = _a.updateInput, varName = _a.varName, node = _a.node, parentVar = _a.parentVar, chainStr = _a.chainStr, insideDoWhen = _a.insideDoWhen, withVars = _a.withVars, context = _a.context;
    var updatedAt = false;
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
                    var innerApocParams = {};
                    if (refNode_1.auth) {
                        var allowAndParams = create_auth_and_params_1.default({
                            operation: "update",
                            node: refNode_1,
                            context: context,
                            varName: _varName,
                            type: "allow",
                        });
                        res.strs.push(allowAndParams[0].replace(/"/g, '\\"'));
                        res.params = __assign(__assign({}, res.params), allowAndParams[1]);
                        innerApocParams = __assign(__assign({}, innerApocParams), allowAndParams[1]);
                    }
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
                    res.params = __assign(__assign({}, res.params), updateAndParams[1]);
                    innerApocParams = __assign(__assign({}, innerApocParams), updateAndParams[1]);
                    if (refNode_1.auth) {
                        var bindAndParams = create_auth_and_params_1.default({
                            operation: "update",
                            node: refNode_1,
                            context: context,
                            varName: _varName,
                            chainStrOverRide: _varName + "_bind",
                            type: "bind",
                        });
                        res.strs.push(bindAndParams[0].replace(/"/g, '\\"'));
                        res.params = __assign(__assign({}, res.params), bindAndParams[1]);
                        innerApocParams = __assign(__assign({}, innerApocParams), bindAndParams[1]);
                    }
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
                    });
                    res.strs.push(connectAndParams[0]);
                    res.params = __assign(__assign({}, res.params), connectAndParams[1]);
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
                        });
                        res.strs.push(createAndParams[0]);
                        res.params = __assign(__assign({}, res.params), createAndParams[1]);
                        res.strs.push("MERGE (" + parentVar + ")" + inStr_1 + relTypeStr_1 + outStr_1 + "(" + innerVarName + ")");
                    });
                }
            });
            return res;
        }
        auth_1.checkRoles({ node: node, context: context, operation: "update" });
        if (node.timestamps && !updatedAt) {
            res.strs.push("SET " + varName + ".updatedAt = datetime()");
            updatedAt = true;
        }
        res.strs.push("SET " + varName + "." + key + " = $" + param);
        res.params[param] = value;
        return res;
    }
    var _b = Object.entries(updateInput).reduce(reducer, { strs: [], params: {} }), strs = _b.strs, params = _b.params;
    return [strs.join("\n"), params];
}
exports.default = createUpdateAndParams;
//# sourceMappingURL=create-update-and-params.js.map