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
var schema_1 = require("../schema");
var Model_1 = __importDefault(require("./Model"));
function filterTypeDefs(typeDefs) {
    var merged = schema_1.mergeTypeDefs(typeDefs);
    var extended = schema_1.mergeExtensionsIntoAST(merged);
    return __assign(__assign({}, extended), { definitions: extended.definitions.reduce(function (res, def) {
            var _a, _b;
            if (def.kind !== "ObjectTypeDefinition" && def.kind !== "InterfaceTypeDefinition") {
                return __spread(res, [def]);
            }
            if (["Query", "Subscription", "Mutation"].includes(def.name.value)) {
                return __spread(res, [def]);
            }
            return __spread(res, [
                __assign(__assign({}, def), { directives: (_a = def.directives) === null || _a === void 0 ? void 0 : _a.filter(function (x) { return !["auth", "exclude"].includes(x.name.value); }), fields: (_b = def.fields) === null || _b === void 0 ? void 0 : _b.reduce(function (r, f) {
                        var _a;
                        return __spread(r, [
                            __assign(__assign({}, f), { directives: (_a = f.directives) === null || _a === void 0 ? void 0 : _a.filter(function (x) { return x.name.value !== "private"; }) }),
                        ]);
                    }, []) }),
            ]);
        }, []) });
}
var OGM = /** @class */ (function () {
    function OGM(input) {
        var _this = this;
        var typeDefs = filterTypeDefs(input.typeDefs);
        this.neoSchema = schema_1.makeAugmentedSchema(__assign(__assign({ typeDefs: typeDefs }, (input.driver ? { context: { driver: input.driver } } : {})), { resolvers: input.resolvers, schemaDirectives: input.schemaDirectives, debug: input.debug }));
        this.models = this.neoSchema.nodes.map(function (n) {
            var selectionSet = "\n                {\n                    " + [n.primitiveFields, n.scalarFields, n.enumFields, n.dateTimeFields].reduce(function (res, v) { return __spread(res, v.map(function (x) { return x.fieldName; })); }, []) + "\n                }\n            ";
            return new Model_1.default({
                neoSchema: _this.neoSchema,
                name: n.name,
                selectionSet: selectionSet,
            });
        });
    }
    OGM.prototype.model = function (name) {
        var found = this.models.find(function (n) { return n.name === name; });
        return found;
    };
    return OGM;
}());
exports.default = OGM;
//# sourceMappingURL=OGM.js.map