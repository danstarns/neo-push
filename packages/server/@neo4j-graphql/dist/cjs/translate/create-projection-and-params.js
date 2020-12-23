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
var auth_1 = require("../auth");
var create_auth_and_params_1 = __importDefault(require("./create-auth-and-params"));
function createProjectionAndParams(_a) {
    var fieldsByTypeName = _a.fieldsByTypeName, node = _a.node, context = _a.context, chainStr = _a.chainStr, varName = _a.varName, chainStrOverRide = _a.chainStrOverRide;
    function reducer(res, _a) {
        var _b = __read(_a, 2), key = _b[0], field = _b[1];
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
        var whereInput = field.args.where;
        var optionsInput = field.args.options;
        var fieldFields = field.fieldsByTypeName;
        var cypherField = node.cypherFields.find(function (x) { return x.fieldName === key; });
        if (cypherField) {
            var projectionStr = "";
            var referenceNode = context.neoSchema.nodes.find(function (x) { return x.name === cypherField.typeMeta.name; });
            if (referenceNode) {
                var recurse = createProjectionAndParams({
                    fieldsByTypeName: fieldFields,
                    node: referenceNode || node,
                    context: context,
                    varName: varName + "_" + key,
                    chainStr: param,
                });
                projectionStr = recurse[0];
                res.params = __assign(__assign({}, res.params), recurse[1]);
            }
            var apocParams = Object.entries(field.args).reduce(function (r, f) {
                var _a;
                var argName = param + "_" + f[0];
                return {
                    strs: __spread(r.strs, [f[0] + ": $" + argName]),
                    params: __assign(__assign({}, r.params), (_a = {}, _a[argName] = f[1], _a)),
                };
            }, { strs: [], params: {} });
            res.params = __assign(__assign({}, res.params), apocParams.params);
            var expectMultipleValues = referenceNode && cypherField.typeMeta.array ? "true" : "false";
            var apocStr = param + " IN apoc.cypher.runFirstColumn(\"" + cypherField.statement + "\", {this: " + (chainStr || varName) + (apocParams.strs.length ? ", " + apocParams.strs.join(", ") : "") + "}, " + expectMultipleValues + ") " + (projectionStr ? "| " + param + " " + projectionStr : "");
            if (!cypherField.typeMeta.array) {
                res.projection.push(key + ": head([" + apocStr + "])");
                return res;
            }
            res.projection.push(key + ": [" + apocStr + "]");
            return res;
        }
        var relationField = node.relationFields.find(function (x) { return x.fieldName === key; });
        if (relationField) {
            var referenceNode = context.neoSchema.nodes.find(function (x) { return x.name === relationField.typeMeta.name; });
            var nodeMatchStr = "(" + (chainStr || varName) + ")";
            var inStr = relationField.direction === "IN" ? "<-" : "-";
            var relTypeStr = "[:" + relationField.type + "]";
            var outStr = relationField.direction === "OUT" ? "->" : "-";
            var nodeOutStr = "(" + param + ":" + (referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.name) + ")";
            var isArray = relationField.typeMeta.array;
            if (relationField.union) {
                var referenceNodes = context.neoSchema.nodes.filter(function (x) { var _a, _b; return (_b = (_a = relationField.union) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.includes(x.name); });
                var unionStrs = [
                    key + ": " + (!isArray ? "head(" : "") + " [(" + (chainStr || varName) + ")" + inStr + relTypeStr + outStr + "(" + param + ")",
                    "WHERE " + referenceNodes.map(function (x) { return "\"" + x.name + "\" IN labels(" + param + ")"; }).join(" OR "),
                    "| head(",
                ];
                var headStrs_1 = [];
                referenceNodes.forEach(function (refNode) {
                    var _param = param + "_" + refNode.name;
                    var innenrHeadStr = [];
                    innenrHeadStr.push("[");
                    innenrHeadStr.push(param + " IN [" + param + "] WHERE \"" + refNode.name + "\" IN labels (" + param + ")");
                    if (refNode.auth) {
                        auth_1.checkRoles({ node: refNode, context: context, operation: "read" });
                    }
                    var thisWhere = field.args[refNode.name];
                    if (thisWhere) {
                        var whereAndParams = create_where_and_params_1.default({
                            context: context,
                            node: refNode,
                            varName: param,
                            whereInput: thisWhere,
                            chainStrOverRide: _param,
                        });
                        innenrHeadStr.push("AND " + whereAndParams[0].replace("WHERE", ""));
                        res.params = __assign(__assign({}, res.params), whereAndParams[1]);
                    }
                    if (refNode.auth) {
                        var allowAndParams = create_auth_and_params_1.default({
                            node: refNode,
                            context: context,
                            varName: param,
                            chainStrOverRide: _param + "_auth",
                            functionType: true,
                            operation: "read",
                            type: "allow",
                        });
                        innenrHeadStr.push("AND " + allowAndParams[0]);
                        res.params = __assign(__assign({}, res.params), allowAndParams[1]);
                    }
                    innenrHeadStr.push("| " + param);
                    if (field.fieldsByTypeName[refNode.name]) {
                        var recurse_1 = createProjectionAndParams({
                            // @ts-ignore
                            fieldsByTypeName: field.fieldsByTypeName,
                            node: refNode,
                            context: context,
                            varName: param,
                            chainStrOverRide: _param,
                        });
                        innenrHeadStr.push(__spread(["{ __resolveType: \"" + refNode.name + "\", "], recurse_1[0].replace("{", "").split("")).join(""));
                        res.params = __assign(__assign({}, res.params), recurse_1[1]);
                    }
                    else {
                        innenrHeadStr.push("{ __resolveType: \"" + refNode.name + "\" } ");
                    }
                    innenrHeadStr.push("]");
                    headStrs_1.push(innenrHeadStr.join(" "));
                });
                unionStrs.push(headStrs_1.join(" + "));
                unionStrs.push(")");
                unionStrs.push("]");
                if (optionsInput) {
                    var sortLimitStr = "";
                    if (optionsInput.skip && !optionsInput.limit) {
                        sortLimitStr = "[" + optionsInput.skip + "..]";
                    }
                    if (optionsInput.limit && !optionsInput.skip) {
                        sortLimitStr = "[.." + optionsInput.limit + "]";
                    }
                    if (optionsInput.limit && optionsInput.skip) {
                        sortLimitStr = "[" + optionsInput.skip + ".." + optionsInput.limit + "]";
                    }
                    unionStrs.push(sortLimitStr);
                }
                unionStrs.push("" + (!isArray ? ")" : ""));
                res.projection.push(unionStrs.join(" "));
                return res;
            }
            if (referenceNode.auth) {
                auth_1.checkRoles({ node: referenceNode, context: context, operation: "read" });
            }
            var whereStr = "";
            var projectionStr = "";
            var authStr = "";
            if (whereInput) {
                var where = create_where_and_params_1.default({
                    whereInput: whereInput,
                    varName: varName + "_" + key,
                    node: node,
                    context: context,
                });
                whereStr = where[0];
                res.params = __assign(__assign({}, res.params), where[1]);
            }
            if (referenceNode.auth) {
                var allowAndParams = create_auth_and_params_1.default({
                    node: referenceNode,
                    context: context,
                    varName: varName + "_" + key,
                    functionType: true,
                    operation: "read",
                    type: "allow",
                });
                authStr = allowAndParams[0];
                res.params = __assign(__assign({}, res.params), allowAndParams[1]);
            }
            var recurse = createProjectionAndParams({
                fieldsByTypeName: fieldFields,
                node: referenceNode || node,
                context: context,
                varName: varName + "_" + key,
                chainStr: param,
            });
            projectionStr = recurse[0];
            res.params = __assign(__assign({}, res.params), recurse[1]);
            var pathStr = "" + nodeMatchStr + inStr + relTypeStr + outStr + nodeOutStr;
            var innerStr = pathStr + " " + whereStr + " " + (authStr ? (!whereStr ? "WHERE " : "") + " " + (whereStr ? "AND " : "") + " " + authStr : "") + " | " + param + " " + projectionStr;
            var nestedQuery = void 0;
            if (optionsInput) {
                var sortLimitStr = "";
                if (optionsInput.skip && !optionsInput.limit) {
                    sortLimitStr = "[" + optionsInput.skip + "..]";
                }
                if (optionsInput.limit && !optionsInput.skip) {
                    sortLimitStr = "[.." + optionsInput.limit + "]";
                }
                if (optionsInput.limit && optionsInput.skip) {
                    sortLimitStr = "[" + optionsInput.skip + ".." + optionsInput.limit + "]";
                }
                if (optionsInput.sort) {
                    var sorts = optionsInput.sort.map(function (x) {
                        var _a = __read(x.split("_"), 2), fieldName = _a[0], op = _a[1];
                        if (op === "DESC") {
                            return "'" + fieldName + "'";
                        }
                        return "'^" + fieldName + "'";
                    });
                    nestedQuery = key + ": apoc.coll.sortMulti([ " + innerStr + " ], [" + sorts.join(", ") + "])" + sortLimitStr;
                }
                else {
                    nestedQuery = key + ": " + (!isArray ? "head(" : "") + "[ " + innerStr + " ]" + sortLimitStr + (!isArray ? ")" : "");
                }
            }
            else {
                nestedQuery = key + ": " + (!isArray ? "head(" : "") + "[ " + innerStr + " ]" + (!isArray ? ")" : "");
            }
            res.projection.push(nestedQuery);
            return res;
        }
        res.projection.push("." + key);
        return res;
    }
    var _b = Object.entries(fieldsByTypeName[node.name]).reduce(reducer, {
        projection: [],
        params: {},
    }), projection = _b.projection, params = _b.params;
    return ["{ " + projection.join(", ") + " }", params];
}
exports.default = createProjectionAndParams;
//# sourceMappingURL=create-projection-and-params.js.map