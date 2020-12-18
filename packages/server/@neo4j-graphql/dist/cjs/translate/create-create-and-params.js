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
var auth_1 = require("../auth");
function createCreateAndParams(_a) {
    var input = _a.input, varName = _a.varName, node = _a.node, context = _a.context, withVars = _a.withVars;
    function reducer(res, _a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], value = _c[1];
        var _varName = varName + "_" + key;
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
                    labelOverride: unionTypeName,
                });
                res.creates.push(connectAndParams[0]);
                res.params = __assign(__assign({}, res.params), connectAndParams[1]);
            }
            return res;
        }
        res.creates.push("SET " + varName + "." + key + " = $" + _varName);
        res.params[_varName] = value;
        return res;
    }
    auth_1.checkRoles({ node: node, context: context, operation: "create" });
    var _b = Object.entries(input).reduce(reducer, {
        creates: ["CREATE (" + varName + ":" + node.name + ")"],
        params: {},
    }), creates = _b.creates, params = _b.params;
    return [creates.join("\n"), params];
}
exports.default = createCreateAndParams;
//# sourceMappingURL=create-create-and-params.js.map