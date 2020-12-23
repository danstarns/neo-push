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
var create_auth_and_params_1 = __importDefault(require("./create-auth-and-params"));
function createConnectAndParams(_a) {
    var withVars = _a.withVars, value = _a.value, varName = _a.varName, relationField = _a.relationField, parentVar = _a.parentVar, refNode = _a.refNode, context = _a.context, labelOverride = _a.labelOverride, parentNode = _a.parentNode, fromCreate = _a.fromCreate;
    function reducer(res, connect, index) {
        var _varName = "" + varName + index;
        var inStr = relationField.direction === "IN" ? "<-" : "-";
        var outStr = relationField.direction === "OUT" ? "->" : "-";
        var relTypeStr = "[:" + relationField.type + "]";
        res.connects.push("WITH " + withVars.join(", "));
        res.connects.push("OPTIONAL MATCH (" + _varName + ":" + (labelOverride || relationField.typeMeta.name) + ")");
        if (connect.where) {
            var where = create_where_and_params_1.default({
                varName: _varName,
                whereInput: connect.where,
                node: refNode,
                context: context,
            });
            res.connects.push(where[0]);
            res.params = __assign(__assign({}, res.params), where[1]);
        }
        if (refNode.auth) {
            var allowAndParams = create_auth_and_params_1.default({
                context: context,
                node: refNode,
                operation: "connect",
                varName: _varName,
                chainStrOverRide: _varName + "_allow",
                type: "allow",
            });
            res.connects.push(allowAndParams[0]);
            res.params = __assign(__assign({}, res.params), allowAndParams[1]);
        }
        /*
           Replace with subclauses https://neo4j.com/developer/kb/conditional-cypher-execution/
           https://neo4j.slack.com/archives/C02PUHA7C/p1603458561099100
        */
        res.connects.push("FOREACH(_ IN CASE " + _varName + " WHEN NULL THEN [] ELSE [1] END | ");
        res.connects.push("MERGE (" + parentVar + ")" + inStr + relTypeStr + outStr + "(" + _varName + ")");
        res.connects.push(")"); // close FOREACH
        if (connect.connect) {
            var connects_1 = (Array.isArray(connect.connect) ? connect.connect : [connect.connect]);
            connects_1.forEach(function (c) {
                var reduced = Object.entries(c).reduce(function (r, _a) {
                    var _b = __read(_a, 2), k = _b[0], v = _b[1];
                    var relField = refNode.relationFields.find(function (x) { return k.startsWith(x.fieldName); });
                    var newRefNode;
                    if (relationField.union) {
                        var _c = __read(k.split(relationField.fieldName + "_").join("").split("_"), 1), modelName_1 = _c[0];
                        newRefNode = context.neoSchema.nodes.find(function (x) { return x.name === modelName_1; });
                    }
                    else {
                        newRefNode = context.neoSchema.nodes.find(function (x) { return x.name === relField.typeMeta.name; });
                    }
                    var recurse = createConnectAndParams({
                        withVars: __spread(withVars, [_varName]),
                        value: v,
                        varName: _varName + "_" + k,
                        relationField: relField,
                        parentVar: _varName,
                        context: context,
                        refNode: newRefNode,
                        parentNode: refNode,
                    });
                    r.connects.push(recurse[0]);
                    r.params = __assign(__assign({}, r.params), recurse[1]);
                    return r;
                }, { connects: [], params: {} });
                res.connects.push(reduced.connects.join("\n"));
                res.params = __assign(__assign({}, res.params), reduced.params);
            });
        }
        return res;
    }
    // eslint-disable-next-line prefer-const
    var _b = (relationField.typeMeta.array ? value : [value]).reduce(reducer, {
        connects: [],
        params: {},
    }), connects = _b.connects, params = _b.params;
    if (parentNode.auth && !fromCreate) {
        var allowAndParams = create_auth_and_params_1.default({
            context: context,
            node: parentNode,
            operation: "connect",
            varName: parentVar,
            chainStrOverRide: parentVar + "_allow",
            type: "allow",
        });
        params = __assign(__assign({}, params), allowAndParams[1]);
        if (allowAndParams[0]) {
            if (withVars) {
                connects = __spread(["WITH " + withVars.join(", ")], connects);
            }
            connects = __spread([allowAndParams[0]], connects);
        }
    }
    return [connects.join("\n"), params];
}
exports.default = createConnectAndParams;
//# sourceMappingURL=create-connect-and-params.js.map