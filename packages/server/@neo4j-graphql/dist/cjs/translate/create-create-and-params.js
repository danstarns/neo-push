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
var create_auth_and_params_1 = __importDefault(require("./create-auth-and-params"));
var constants_1 = require("../constants");
function createCreateAndParams(_a) {
    var input = _a.input, varName = _a.varName, node = _a.node, context = _a.context, withVars = _a.withVars, insideDoWhen = _a.insideDoWhen;
    function reducer(res, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        var _varName = varName + "_" + key;
        var relationField = node.relationFields.find(function (x) { return key.startsWith(x.fieldName); });
        var primitiveField = node.primitiveFields.find(function (x) { return key === x.fieldName; });
        var pointField = node.pointFields.find(function (x) { return key.startsWith(x.fieldName); });
        if (relationField) {
            var refNode_1;
            var unionTypeName_1 = "";
            if (relationField.union) {
                _b = __read(key.split(relationField.fieldName + "_").join("").split("_"), 1), unionTypeName_1 = _b[0];
                refNode_1 = context.neoSchema.nodes.find(function (x) { return x.name === unionTypeName_1; });
            }
            else {
                refNode_1 = context.neoSchema.nodes.find(function (x) { return x.name === relationField.typeMeta.name; });
            }
            if (value.create) {
                var creates_1 = relationField.typeMeta.array ? value.create : [value.create];
                creates_1.forEach(function (create, index) {
                    var innerVarName = "" + _varName + index;
                    res.creates.push("\nWITH " + withVars.join(", "));
                    var recurse = createCreateAndParams({
                        input: create,
                        context: context,
                        node: refNode_1,
                        varName: innerVarName,
                        withVars: __spread(withVars, [innerVarName]),
                    });
                    res.creates.push(recurse[0]);
                    res.params = __assign(__assign({}, res.params), recurse[1]);
                    var inStr = relationField.direction === "IN" ? "<-" : "-";
                    var outStr = relationField.direction === "OUT" ? "->" : "-";
                    var relTypeStr = "[:" + relationField.type + "]";
                    res.creates.push("MERGE (" + varName + ")" + inStr + relTypeStr + outStr + "(" + innerVarName + ")");
                });
            }
            if (value.connect) {
                var connectAndParams = create_connect_and_params_1.default({
                    withVars: withVars,
                    value: value.connect,
                    varName: _varName + "_connect",
                    parentVar: varName,
                    relationField: relationField,
                    context: context,
                    refNode: refNode_1,
                    labelOverride: unionTypeName_1,
                    parentNode: node,
                    fromCreate: true,
                });
                res.creates.push(connectAndParams[0]);
                res.params = __assign(__assign({}, res.params), connectAndParams[1]);
            }
            return res;
        }
        if (primitiveField === null || primitiveField === void 0 ? void 0 : primitiveField.auth) {
            var authAndParams = create_auth_and_params_1.default({
                entity: primitiveField,
                operation: "create",
                context: context,
                bind: { parentNode: node, varName: varName, chainStr: _varName },
                escapeQuotes: Boolean(insideDoWhen),
            });
            if (authAndParams[0]) {
                if (!res.meta) {
                    res.meta = { authStrs: [] };
                }
                res.meta.authStrs.push(authAndParams[0]);
                res.params = __assign(__assign({}, res.params), authAndParams[1]);
            }
        }
        if (primitiveField === null || primitiveField === void 0 ? void 0 : primitiveField.autogenerate) {
            res.creates.push("SET " + varName + "." + key + " = randomUUID()");
            return res;
        }
        if (pointField) {
            if (pointField.typeMeta.array) {
                res.creates.push("SET " + varName + "." + key + " = [p in $" + _varName + " | point(p)]");
            }
            else {
                res.creates.push("SET " + varName + "." + key + " = point($" + _varName + ")");
            }
        }
        else {
            res.creates.push("SET " + varName + "." + key + " = $" + _varName);
        }
        res.params[_varName] = value;
        return res;
    }
    var initial = ["CREATE (" + varName + ":" + node.name + ")"];
    var timestamps = node.dateTimeFields.filter(function (x) { return x.timestamps && x.timestamps.includes("create"); });
    timestamps.forEach(function (ts) {
        initial.push("SET " + varName + "." + ts.fieldName + " = datetime()");
    });
    // eslint-disable-next-line prefer-const
    var _b = Object.entries(input).reduce(reducer, {
        creates: initial,
        params: {},
    }), creates = _b.creates, params = _b.params, meta = _b.meta;
    var forbiddenString = insideDoWhen ? "\\\"" + constants_1.AUTH_FORBIDDEN_ERROR + "\\\"" : "\"" + constants_1.AUTH_FORBIDDEN_ERROR + "\"";
    if (node.auth) {
        var bindAndParams = create_auth_and_params_1.default({
            entity: node,
            operation: "create",
            context: context,
            bind: { parentNode: node, varName: varName },
            escapeQuotes: Boolean(insideDoWhen),
        });
        if (bindAndParams[0]) {
            creates.push("WITH " + withVars.join(", "));
            creates.push("CALL apoc.util.validate(NOT(" + bindAndParams[0] + "), " + forbiddenString + ", [0])");
            params = __assign(__assign({}, params), bindAndParams[1]);
        }
    }
    if (meta === null || meta === void 0 ? void 0 : meta.authStrs.length) {
        creates.push("WITH " + withVars.join(", "));
        creates.push("CALL apoc.util.validate(NOT(" + meta.authStrs.join(" AND ") + "), " + forbiddenString + ", [0])");
    }
    return [creates.join("\n"), params];
}
exports.default = createCreateAndParams;
//# sourceMappingURL=create-create-and-params.js.map