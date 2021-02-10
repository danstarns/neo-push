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
var classes_1 = require("../classes");
var create_auth_param_1 = __importDefault(require("../translate/create-auth-param"));
function wrapCustomResolvers(_a) {
    var resolvers = _a.resolvers, generatedResolvers = _a.generatedResolvers, nodeNames = _a.nodeNames, getNeoSchema = _a.getNeoSchema;
    var newResolvers = {};
    var _b = resolvers, _c = _b.Query, customQueries = _c === void 0 ? {} : _c, _d = _b.Mutation, customMutations = _d === void 0 ? {} : _d, _e = _b.Subscription, customSubscriptions = _e === void 0 ? {} : _e, rest = __rest(_b, ["Query", "Mutation", "Subscription"]);
    if (customQueries) {
        if (generatedResolvers.Query) {
            newResolvers.Query = __assign(__assign({}, generatedResolvers.Query), customQueries);
        }
        else {
            newResolvers.Query = customQueries;
        }
    }
    if (customMutations) {
        if (generatedResolvers.Mutation) {
            newResolvers.Mutation = __assign(__assign({}, generatedResolvers.Mutation), customMutations);
        }
        else {
            newResolvers.Mutation = customMutations;
        }
    }
    if (Object.keys(customSubscriptions).length) {
        newResolvers.Subscription = customSubscriptions;
    }
    var typeResolvers = Object.entries(rest).reduce(function (r, entry) {
        var _a;
        var _b = __read(entry, 2), key = _b[0], value = _b[1];
        if (!nodeNames.includes(key)) {
            return r;
        }
        return __assign(__assign({}, r), (_a = {}, _a[key] = __assign(__assign({}, generatedResolvers[key]), value), _a));
    }, {});
    newResolvers = __assign(__assign({}, newResolvers), typeResolvers);
    (function wrapResolvers(obj) {
        Object.entries(obj).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            if (typeof value === "function") {
                obj[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var driver = args[2].driver;
                    if (!driver) {
                        throw new Error("context.diver missing");
                    }
                    var neoSchema = getNeoSchema();
                    var context = new classes_1.Context({ neoSchema: neoSchema, driver: driver, graphQLContext: args[2] });
                    var auth = create_auth_param_1.default({ context: context });
                    args[2] = __assign(__assign({}, args[2]), { auth: auth });
                    return value.apply(void 0, __spread(args));
                };
                return;
            }
            if (typeof value === "object") {
                obj[key] = value;
                wrapResolvers(value);
            }
        });
        return obj;
    })(newResolvers);
    // Not to wrap the scalars and directives
    var otherResolvers = Object.entries(rest).reduce(function (r, entry) {
        var _a;
        var _b = __read(entry, 2), key = _b[0], value = _b[1];
        if (nodeNames.includes(key)) {
            return r;
        }
        return __assign(__assign({}, r), (_a = {}, _a[key] = value, _a));
    }, {});
    newResolvers = __assign(__assign({}, newResolvers), otherResolvers);
    return newResolvers;
}
exports.default = wrapCustomResolvers;
//# sourceMappingURL=wrap-custom-resolvers.js.map