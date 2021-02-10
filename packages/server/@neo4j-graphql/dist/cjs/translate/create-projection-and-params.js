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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var create_auth_param_1 = __importDefault(require("./create-auth-param"));
var constants_1 = require("../constants");
function createProjectionAndParams(_a) {
    var fieldsByTypeName = _a.fieldsByTypeName, node = _a.node, context = _a.context, chainStr = _a.chainStr, varName = _a.varName, chainStrOverRide = _a.chainStrOverRide;
    function reducer(res, _a) {
        var _b, _c;
        var _d = __read(_a, 2), k = _d[0], field = _d[1];
        var key = k;
        var alias = field.alias !== field.name ? field.alias : undefined;
        if (alias) {
            key = field.name;
        }
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
        var relationField = node.relationFields.find(function (x) { return x.fieldName === key; });
        var pointField = node.pointFields.find(function (x) { return x.fieldName === key; });
        var dateTimeField = node.dateTimeFields.find(function (x) { return x.fieldName === key; });
        var authableField = node.authableFields.find(function (x) { return x.fieldName === key; });
        if (authableField) {
            if (authableField.auth) {
                var authAndParams = create_auth_and_params_1.default({
                    entity: authableField,
                    operation: "read",
                    context: context,
                    allow: { parentNode: node, varName: varName, chainStr: param },
                });
                if (authAndParams[0]) {
                    if (!res.meta) {
                        res.meta = { authStrs: [] };
                    }
                    res.meta.authStrs.push(authAndParams[0]);
                    res.params = __assign(__assign({}, res.params), authAndParams[1]);
                }
            }
        }
        if (cypherField) {
            var projectionAuthStr = "";
            var projectionStr = "";
            var isPrimitive = ["ID", "String", "Boolean", "Float", "Int", "DateTime"].includes(cypherField.typeMeta.name);
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
                if ((_b = recurse[2]) === null || _b === void 0 ? void 0 : _b.authStrs.length) {
                    projectionAuthStr = recurse[2].authStrs.join(" AND ");
                }
            }
            var apocParams = Object.entries(field.args).reduce(function (r, entry) {
                var _a;
                var argName = param + "_" + entry[0];
                return {
                    strs: __spread(r.strs, [entry[0] + ": $" + argName]),
                    params: __assign(__assign({}, r.params), (_a = {}, _a[argName] = entry[1], _a)),
                };
            }, { strs: ["auth: $auth"], params: {} });
            res.params = __assign(__assign(__assign({}, res.params), apocParams.params), { auth: create_auth_param_1.default({ context: context }) });
            var expectMultipleValues = referenceNode && cypherField.typeMeta.array ? "true" : "false";
            var apocStr = (!isPrimitive ? param + " IN" : "") + " apoc.cypher.runFirstColumn(\"" + cypherField.statement + "\", {this: " + (chainStr || varName) + (apocParams.strs.length ? ", " + apocParams.strs.join(", ") : "") + "}, " + expectMultipleValues + ") " + (projectionAuthStr
                ? "WHERE apoc.util.validatePredicate(NOT(" + projectionAuthStr + "), \"" + constants_1.AUTH_FORBIDDEN_ERROR + "\", [0])"
                : "") + " " + (projectionStr ? "| " + param + " " + projectionStr : "");
            if (!cypherField.typeMeta.array) {
                res.projection.push(key + ": head([" + apocStr + "])");
                return res;
            }
            if (isPrimitive) {
                res.projection.push(key + ": " + apocStr);
            }
            else {
                res.projection.push(key + ": [" + apocStr + "]");
            }
            return res;
        }
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
                    var _a, _b;
                    var varNameOverRide = param + "_" + refNode.name;
                    var innerHeadStr = [];
                    innerHeadStr.push("[");
                    innerHeadStr.push(param + " IN [" + param + "] WHERE \"" + refNode.name + "\" IN labels (" + param + ")");
                    var thisWhere = field.args[refNode.name];
                    if (thisWhere) {
                        var whereAndParams = create_where_and_params_1.default({
                            context: context,
                            node: refNode,
                            varName: param,
                            whereInput: thisWhere,
                            chainStrOverRide: varNameOverRide,
                        });
                        innerHeadStr.push("AND " + whereAndParams[0].replace("WHERE", ""));
                        res.params = __assign(__assign({}, res.params), whereAndParams[1]);
                    }
                    var preAuth = create_auth_and_params_1.default({
                        entity: refNode,
                        operation: "read",
                        context: context,
                        allow: {
                            parentNode: refNode,
                            varName: param,
                            chainStr: varNameOverRide,
                        },
                    });
                    if (preAuth[0]) {
                        innerHeadStr.push("AND apoc.util.validatePredicate(NOT(" + preAuth[0] + "), \"" + constants_1.AUTH_FORBIDDEN_ERROR + "\", [0])");
                        res.params = __assign(__assign({}, res.params), preAuth[1]);
                    }
                    if (field.fieldsByTypeName[refNode.name]) {
                        var recurse_1 = createProjectionAndParams({
                            // @ts-ignore
                            fieldsByTypeName: field.fieldsByTypeName,
                            node: refNode,
                            context: context,
                            varName: param,
                            chainStrOverRide: varNameOverRide,
                        });
                        if ((_a = recurse_1[2]) === null || _a === void 0 ? void 0 : _a.authStrs.length) {
                            innerHeadStr.push("AND apoc.util.validatePredicate(NOT(" + ((_b = recurse_1[2]) === null || _b === void 0 ? void 0 : _b.authStrs.join(" AND ")) + "), \"" + constants_1.AUTH_FORBIDDEN_ERROR + "\", [0])");
                        }
                        innerHeadStr.push("| " + param);
                        innerHeadStr.push(__spread(["{ __resolveType: \"" + refNode.name + "\", "], recurse_1[0].replace("{", "").split("")).join(""));
                        res.params = __assign(__assign({}, res.params), recurse_1[1]);
                    }
                    else {
                        innerHeadStr.push("| " + param);
                        innerHeadStr.push("{ __resolveType: \"" + refNode.name + "\" } ");
                    }
                    innerHeadStr.push("]");
                    headStrs_1.push(innerHeadStr.join(" "));
                });
                unionStrs.push(headStrs_1.join(" + "));
                unionStrs.push(")");
                unionStrs.push("]");
                if (optionsInput) {
                    var hasSkip = Boolean(optionsInput.skip) || optionsInput.skip === 0;
                    var hasLimit = Boolean(optionsInput.limit) || optionsInput.limit === 0;
                    var sortLimitStr = "";
                    if (hasSkip && !hasLimit) {
                        sortLimitStr = "[" + optionsInput.skip + "..]";
                    }
                    if (hasLimit && !hasSkip) {
                        sortLimitStr = "[.." + optionsInput.limit + "]";
                    }
                    if (hasLimit && hasSkip) {
                        sortLimitStr = "[" + optionsInput.skip + ".." + optionsInput.limit + "]";
                    }
                    unionStrs.push(sortLimitStr);
                }
                unionStrs.push("" + (!isArray ? ")" : ""));
                res.projection.push(unionStrs.join(" "));
                return res;
            }
            var whereStr = "";
            var projectionStr = "";
            var authStrs = [];
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
            var preAuth = create_auth_and_params_1.default({
                entity: referenceNode,
                operation: "read",
                context: context,
                allow: {
                    parentNode: referenceNode,
                    varName: varName + "_" + key,
                },
            });
            if (preAuth[0]) {
                authStrs.push(preAuth[0]);
                res.params = __assign(__assign({}, res.params), preAuth[1]);
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
            if ((_c = recurse[2]) === null || _c === void 0 ? void 0 : _c.authStrs.length) {
                authStrs = __spread(authStrs, recurse[2].authStrs);
            }
            var pathStr = "" + nodeMatchStr + inStr + relTypeStr + outStr + nodeOutStr;
            var innerStr = pathStr + " " + whereStr + " " + (authStrs.length
                ? (!whereStr ? "WHERE " : "") + " " + (whereStr ? "AND " : "") + " apoc.util.validatePredicate(NOT(" + authStrs.join(" AND ") + "), \"" + constants_1.AUTH_FORBIDDEN_ERROR + "\", [0])"
                : "") + " | " + param + " " + projectionStr;
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
        if (pointField) {
            var isArray = pointField.typeMeta.array;
            var _e = fieldFields[pointField.typeMeta.name], crs = _e.crs, point = __rest(_e, ["crs"]);
            var fields = [];
            // Sadly need to select the whole point object due to the risk of height/z
            // being selected on a 2D point, to which the database will throw an error
            if (point) {
                fields.push(isArray ? "point:p" : "point: " + varName + "." + key);
            }
            if (crs) {
                fields.push(isArray ? "crs: p.crs" : "crs: " + varName + "." + key + ".crs");
            }
            res.projection.push(isArray
                ? key + ": [p in " + varName + "." + key + " | { " + fields.join(", ") + " }]"
                : key + ": { " + fields.join(", ") + " }");
        }
        else if (dateTimeField) {
            res.projection.push(dateTimeField.typeMeta.array
                ? key + ": [ dt in " + varName + "." + key + " | apoc.date.convertFormat(toString(dt), \"iso_zoned_date_time\", \"iso_offset_date_time\") ]"
                : key + ": apoc.date.convertFormat(toString(" + varName + "." + key + "), \"iso_zoned_date_time\", \"iso_offset_date_time\")");
        }
        else {
            res.projection.push("." + key);
        }
        return res;
    }
    var _b = Object.entries(fieldsByTypeName[node.name]).reduce(reducer, {
        projection: [],
        params: {},
    }), projection = _b.projection, params = _b.params, meta = _b.meta;
    return ["{ " + projection.join(", ") + " }", params, meta];
}
exports.default = createProjectionAndParams;
//# sourceMappingURL=create-projection-and-params.js.map