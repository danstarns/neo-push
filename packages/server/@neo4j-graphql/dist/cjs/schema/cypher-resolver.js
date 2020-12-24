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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j_driver_1 = require("neo4j-driver");
var utils_1 = require("../utils");
var get_field_type_meta_1 = __importDefault(require("./get-field-type-meta"));
var classes_1 = require("../classes");
/**
 * Called on custom (Queries & Mutations "TOP LEVEL") with a @cypher directive. Not to mistaken for @cypher type fields.
 */
function cypherResolver(_a) {
    var defaultAccessMode = _a.defaultAccessMode, field = _a.field, statement = _a.statement, getSchema = _a.getSchema;
    function resolve(_root, args, graphQLContext) {
        return __awaiter(this, void 0, void 0, function () {
            var neoSchema, driver, context, safeJWT, result, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        neoSchema = getSchema();
                        driver = graphQLContext.driver;
                        if (!driver) {
                            throw new Error("context.driver missing");
                        }
                        context = new classes_1.Context({
                            graphQLContext: graphQLContext,
                            neoSchema: neoSchema,
                            driver: driver,
                        });
                        safeJWT = context.getJWTSafe();
                        return [4 /*yield*/, utils_1.execute({
                                cypher: statement,
                                params: utils_1.serialize(__assign(__assign({}, args), { jwt: safeJWT })),
                                driver: driver,
                                defaultAccessMode: defaultAccessMode,
                                neoSchema: neoSchema,
                                raw: true,
                            })];
                    case 1:
                        result = _a.sent();
                        values = result.records.map(function (record) {
                            var value = record._fields[0];
                            if (["number", "string", "boolean"].includes(typeof value)) {
                                return value;
                            }
                            if (!value) {
                                return undefined;
                            }
                            if (neo4j_driver_1.isInt(value)) {
                                return Number(value);
                            }
                            if (value.identity && value.labels && value.properties) {
                                return utils_1.deserialize(value.properties);
                            }
                            return utils_1.deserialize(value);
                        });
                        if (!field.typeMeta.array) {
                            return [2 /*return*/, values[0]];
                        }
                        return [2 /*return*/, values];
                }
            });
        });
    }
    return {
        type: field.typeMeta.pretty,
        resolve: resolve,
        args: field.arguments.reduce(function (args, arg) {
            var _a;
            var meta = get_field_type_meta_1.default(arg);
            return __assign(__assign({}, args), (_a = {}, _a[arg.name.value] = {
                type: meta.pretty,
                description: arg.description,
                defaultValue: arg.defaultValue,
            }, _a));
        }, {}),
    };
}
exports.default = cypherResolver;
//# sourceMappingURL=cypher-resolver.js.map