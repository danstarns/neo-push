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
var camelcase_1 = __importDefault(require("camelcase"));
var graphql_parse_resolve_info_1 = require("graphql-parse-resolve-info");
var pluralize_1 = __importDefault(require("pluralize"));
var classes_1 = require("../classes");
var create_where_and_params_1 = __importDefault(require("./create-where-and-params"));
var create_projection_and_params_1 = __importDefault(require("./create-projection-and-params"));
var create_create_and_params_1 = __importDefault(require("./create-create-and-params"));
var create_auth_and_params_1 = __importDefault(require("./create-auth-and-params"));
var create_update_and_params_1 = __importDefault(require("./create-update-and-params"));
var create_connect_and_params_1 = __importDefault(require("./create-connect-and-params"));
var create_disconnect_and_params_1 = __importDefault(require("./create-disconnect-and-params"));
var create_auth_param_1 = __importDefault(require("./create-auth-param"));
var constants_1 = require("../constants");
function translateRead(_a) {
    var _b;
    var resolveTree = _a.resolveTree, node = _a.node, context = _a.context;
    var whereInput = resolveTree.args.where;
    var optionsInput = resolveTree.args.options;
    var fieldsByTypeName = resolveTree.fieldsByTypeName;
    var varName = "this";
    var matchStr = "MATCH (" + varName + ":" + node.name + ")";
    var whereStr = "";
    var authStr = "";
    var skipStr = "";
    var limitStr = "";
    var sortStr = "";
    var projAuth = "";
    var projStr = "";
    var cypherParams = {};
    var projection = create_projection_and_params_1.default({
        node: node,
        context: context,
        fieldsByTypeName: fieldsByTypeName,
        varName: varName,
    });
    projStr = projection[0];
    cypherParams = __assign(__assign({}, cypherParams), projection[1]);
    if ((_b = projection[2]) === null || _b === void 0 ? void 0 : _b.authStrs.length) {
        projAuth = "CALL apoc.util.validate(NOT(" + projection[2].authStrs.join(" AND ") + "), \"" + constants_1.AUTH_FORBIDDEN_ERROR + "\", [0])";
    }
    if (whereInput) {
        var where = create_where_and_params_1.default({
            whereInput: whereInput,
            varName: varName,
            node: node,
            context: context,
        });
        whereStr = where[0];
        cypherParams = __assign(__assign({}, cypherParams), where[1]);
    }
    if (node.auth) {
        var allowAndParams = create_auth_and_params_1.default({
            operation: "read",
            entity: node,
            context: context,
            allow: {
                parentNode: node,
                varName: varName,
            },
        });
        if (allowAndParams[0]) {
            cypherParams = __assign(__assign({}, cypherParams), allowAndParams[1]);
            authStr = "CALL apoc.util.validate(NOT(" + allowAndParams[0] + "), \"" + constants_1.AUTH_FORBIDDEN_ERROR + "\", [0])";
        }
    }
    if (optionsInput) {
        var hasSkip = Boolean(optionsInput.skip) || optionsInput.skip === 0;
        var hasLimit = Boolean(optionsInput.limit) || optionsInput.limit === 0;
        if (hasSkip) {
            skipStr = "SKIP $" + varName + "_skip";
            cypherParams[varName + "_skip"] = optionsInput.skip;
        }
        if (hasLimit) {
            limitStr = "LIMIT $" + varName + "_limit";
            cypherParams[varName + "_limit"] = optionsInput.limit;
        }
        if (optionsInput.sort && optionsInput.sort.length) {
            var sortArr = optionsInput.sort.map(function (s) {
                var _a, _b;
                var key;
                var direc;
                if (s.includes("_DESC")) {
                    direc = "DESC";
                    _a = __read(s.split("_DESC"), 1), key = _a[0];
                }
                else {
                    direc = "ASC";
                    _b = __read(s.split("_ASC"), 1), key = _b[0];
                }
                return varName + "." + key + " " + direc;
            });
            sortStr = "ORDER BY " + sortArr.join(", ");
        }
    }
    var cypher = __spread([
        matchStr,
        whereStr,
        authStr
    ], (sortStr ? ["WITH " + varName, sortStr] : []), (projAuth ? ["WITH " + varName, projAuth] : []), [
        "RETURN " + varName + " " + projStr + " as " + varName,
        skipStr,
        limitStr,
    ]);
    return [cypher.filter(Boolean).join("\n"), cypherParams];
}
function translateCreate(_a) {
    var _b;
    var context = _a.context, resolveTree = _a.resolveTree, node = _a.node;
    var fieldsByTypeName = resolveTree.fieldsByTypeName["Create" + pluralize_1.default(node.name) + "MutationResponse"][pluralize_1.default(camelcase_1.default(node.name))]
        .fieldsByTypeName;
    var _c = resolveTree.args.input.reduce(function (res, input, index) {
        var varName = "this" + index;
        var create = ["CALL {"];
        var createAndParams = create_create_and_params_1.default({
            input: input,
            node: node,
            context: context,
            varName: varName,
            withVars: [varName],
        });
        create.push("" + createAndParams[0]);
        create.push("RETURN " + varName);
        create.push("}");
        res.createStrs.push(create.join("\n"));
        res.params = __assign(__assign({}, res.params), createAndParams[1]);
        return res;
    }, { createStrs: [], params: {}, withVars: [] }), createStrs = _c.createStrs, params = _c.params;
    /* so projection params don't conflict with create params. We only need to call createProjectionAndParams once. */
    var projAuth = "";
    var projection = create_projection_and_params_1.default({
        node: node,
        context: context,
        fieldsByTypeName: fieldsByTypeName,
        varName: "REPLACE_ME",
    });
    if ((_b = projection[2]) === null || _b === void 0 ? void 0 : _b.authStrs.length) {
        projAuth = "CALL apoc.util.validate(NOT(" + projection[2].authStrs.join(" AND ") + "), \"" + constants_1.AUTH_FORBIDDEN_ERROR + "\", [0])";
    }
    var replacedProjectionParams = Object.entries(projection[1]).reduce(function (res, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        return __assign(__assign({}, res), (_b = {}, _b[key.replace("REPLACE_ME", "projection")] = value, _b));
    }, {});
    var projectionStr = createStrs
        .map(function (_, i) {
        return "\nthis" + i + " " + projection[0]
            .replace(/\$REPLACE_ME/g, "$projection")
            .replace(/REPLACE_ME/g, "this" + i) + " AS this" + i;
    })
        .join(", ");
    var authCalls = createStrs
        .map(function (_, i) { return projAuth.replace(/\$REPLACE_ME/g, "$projection").replace(/REPLACE_ME/g, "this" + i); })
        .join("\n");
    var cypher = ["" + createStrs.join("\n"), authCalls, "\nRETURN " + projectionStr];
    return [cypher.filter(Boolean).join("\n"), __assign(__assign({}, params), replacedProjectionParams)];
}
function translateUpdate(_a) {
    var _b;
    var resolveTree = _a.resolveTree, node = _a.node, context = _a.context;
    var whereInput = resolveTree.args.where;
    var updateInput = resolveTree.args.update;
    var connectInput = resolveTree.args.connect;
    var disconnectInput = resolveTree.args.disconnect;
    var createInput = resolveTree.args.create;
    var varName = "this";
    var matchStr = "MATCH (" + varName + ":" + node.name + ")";
    var whereStr = "";
    var updateStr = "";
    var connectStr = "";
    var disconnectStr = "";
    var createStr = "";
    var projAuth = "";
    var projStr = "";
    var cypherParams = {};
    var fieldsByTypeName = resolveTree.fieldsByTypeName["Update" + pluralize_1.default(node.name) + "MutationResponse"][pluralize_1.default(camelcase_1.default(node.name))]
        .fieldsByTypeName;
    if (whereInput) {
        var where = create_where_and_params_1.default({
            whereInput: whereInput,
            varName: varName,
            node: node,
            context: context,
        });
        whereStr = where[0];
        cypherParams = __assign(__assign({}, cypherParams), where[1]);
    }
    if (updateInput) {
        var updateAndParams = create_update_and_params_1.default({
            context: context,
            node: node,
            updateInput: updateInput,
            varName: varName,
            parentVar: varName,
            withVars: [varName],
        });
        updateStr = updateAndParams[0];
        cypherParams = __assign(__assign({}, cypherParams), updateAndParams[1]);
    }
    if (disconnectInput) {
        Object.entries(disconnectInput).forEach(function (entry) {
            var relationField = node.relationFields.find(function (x) { return x.fieldName === entry[0]; });
            var refNode = context.neoSchema.nodes.find(function (x) { return x.name === relationField.typeMeta.name; });
            var disconnectAndParams = create_disconnect_and_params_1.default({
                context: context,
                parentVar: varName,
                refNode: refNode,
                relationField: relationField,
                value: entry[1],
                varName: varName + "_disconnect_" + entry[0],
                withVars: [varName],
                parentNode: node,
            });
            disconnectStr = disconnectAndParams[0];
            cypherParams = __assign(__assign({}, cypherParams), disconnectAndParams[1]);
        });
    }
    if (connectInput) {
        Object.entries(connectInput).forEach(function (entry) {
            var relationField = node.relationFields.find(function (x) { return x.fieldName === entry[0]; });
            var refNode = context.neoSchema.nodes.find(function (x) { return x.name === relationField.typeMeta.name; });
            var connectAndParams = create_connect_and_params_1.default({
                context: context,
                parentVar: varName,
                refNode: refNode,
                relationField: relationField,
                value: entry[1],
                varName: varName + "_connect_" + entry[0],
                withVars: [varName],
                parentNode: node,
            });
            connectStr = connectAndParams[0];
            cypherParams = __assign(__assign({}, cypherParams), connectAndParams[1]);
        });
    }
    if (createInput) {
        Object.entries(createInput).forEach(function (entry) {
            var relationField = node.relationFields.find(function (x) { return x.fieldName === entry[0]; });
            var refNode = context.neoSchema.nodes.find(function (x) { return x.name === relationField.typeMeta.name; });
            var inStr = relationField.direction === "IN" ? "<-" : "-";
            var outStr = relationField.direction === "OUT" ? "->" : "-";
            var relTypeStr = "[:" + relationField.type + "]";
            var creates = relationField.typeMeta.array ? entry[1] : [entry[1]];
            creates.forEach(function (create, index) {
                var innerVarName = varName + "_create_" + entry[0] + index;
                var createAndParams = create_create_and_params_1.default({
                    context: context,
                    node: refNode,
                    input: create,
                    varName: innerVarName,
                    withVars: [varName, innerVarName],
                });
                createStr = createAndParams[0];
                cypherParams = __assign(__assign({}, cypherParams), createAndParams[1]);
                createStr += "\nMERGE (" + varName + ")" + inStr + relTypeStr + outStr + "(" + innerVarName + ")";
            });
        });
    }
    var projection = create_projection_and_params_1.default({
        node: node,
        context: context,
        fieldsByTypeName: fieldsByTypeName,
        varName: varName,
    });
    projStr = projection[0];
    cypherParams = __assign(__assign({}, cypherParams), projection[1]);
    if ((_b = projection[2]) === null || _b === void 0 ? void 0 : _b.authStrs.length) {
        projAuth = "CALL apoc.util.validate(NOT(" + projection[2].authStrs.join(" AND ") + "), \"" + constants_1.AUTH_FORBIDDEN_ERROR + "\", [0])";
    }
    var cypher = __spread([
        matchStr,
        whereStr,
        updateStr,
        connectStr,
        disconnectStr,
        createStr
    ], (projAuth ? ["WITH " + varName, projAuth] : []), [
        "RETURN " + varName + " " + projStr + " AS " + varName,
    ]);
    return [cypher.filter(Boolean).join("\n"), cypherParams];
}
function translateDelete(_a) {
    var resolveTree = _a.resolveTree, node = _a.node, context = _a.context;
    var whereInput = resolveTree.args.where;
    var varName = "this";
    var matchStr = "MATCH (" + varName + ":" + node.name + ")";
    var whereStr = "";
    var preAuthStr = "";
    var cypherParams = {};
    if (whereInput) {
        var where = create_where_and_params_1.default({
            whereInput: whereInput,
            varName: varName,
            node: node,
            context: context,
        });
        whereStr = where[0];
        cypherParams = __assign(__assign({}, cypherParams), where[1]);
    }
    var preAuth = create_auth_and_params_1.default({
        operation: "delete",
        entity: node,
        context: context,
        allow: {
            parentNode: node,
            varName: varName,
        },
    });
    if (preAuth[0]) {
        cypherParams = __assign(__assign({}, cypherParams), preAuth[1]);
        preAuthStr = "WITH " + varName + "\nCALL apoc.util.validate(NOT(" + preAuth[0] + "), \"" + constants_1.AUTH_FORBIDDEN_ERROR + "\", [0])";
    }
    var cypher = [matchStr, whereStr, preAuthStr, "DETACH DELETE " + varName];
    return [cypher.filter(Boolean).join("\n"), cypherParams];
}
function translate(_a) {
    var _b, _c, _d, _e;
    var graphQLContext = _a.context, resolveInfo = _a.resolveInfo;
    var neoSchema = graphQLContext.neoSchema;
    if (!neoSchema || !(neoSchema instanceof classes_1.NeoSchema)) {
        throw new Error("invalid schema");
    }
    var context = new classes_1.Context({
        graphQLContext: graphQLContext,
        neoSchema: neoSchema,
        driver: graphQLContext.driver,
    });
    var resolveTree = graphql_parse_resolve_info_1.parseResolveInfo(resolveInfo);
    var operationType = resolveInfo.operation.operation;
    var operationName = resolveInfo.fieldName;
    var operation = "read";
    var node;
    if (operationType === "mutation") {
        if (operationName.includes("create")) {
            operation = "create";
        }
        if (operationName.includes("delete")) {
            operation = "delete";
        }
        if (operationName.includes("update")) {
            operation = "update";
        }
        node = context.neoSchema.nodes.find(function (x) { return x.name === pluralize_1.default.singular(resolveTree.name.split(operation)[1]); });
    }
    else {
        operation = "read";
        node = context.neoSchema.nodes.find(function (x) { return camelcase_1.default(x.name) === pluralize_1.default.singular(resolveTree.name); });
    }
    var query = "";
    var params = {};
    switch (operation) {
        case "create":
            _b = __read(translateCreate({
                resolveTree: resolveTree,
                node: node,
                context: context,
            }), 2), query = _b[0], params = _b[1];
            break;
        case "update":
            _c = __read(translateUpdate({
                resolveTree: resolveTree,
                node: node,
                context: context,
            }), 2), query = _c[0], params = _c[1];
            break;
        case "delete":
            _d = __read(translateDelete({
                resolveTree: resolveTree,
                node: node,
                context: context,
            }), 2), query = _d[0], params = _d[1];
            break;
        default:
            _e = __read(translateRead({
                resolveTree: resolveTree,
                node: node,
                context: context,
            }), 2), query = _e[0], params = _e[1];
            break;
    }
    // Its really difficult to know when users are using the `auth` param. For Simplicity it better to do the check here
    if (query.includes("$auth.") || query.includes("auth: $auth") || query.includes("auth:$auth")) {
        params.auth = create_auth_param_1.default({ context: context });
    }
    return [query, params];
}
exports.default = translate;
//# sourceMappingURL=translate.js.map