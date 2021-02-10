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
var graphql_1 = require("graphql");
var pluralize_1 = __importDefault(require("pluralize"));
var camelcase_1 = __importDefault(require("camelcase"));
var utils_1 = require("../utils");
function printSelectionSet(selectionSet) {
    if (typeof selectionSet === "string") {
        return graphql_1.print(graphql_1.parse(selectionSet));
    }
    return graphql_1.print(selectionSet);
}
var Model = /** @class */ (function () {
    function Model(input) {
        this.name = input.name;
        this.namePluralized = pluralize_1.default(input.name);
        this.camelCaseName = camelcase_1.default(this.namePluralized);
        this.neoSchema = input.neoSchema;
        this.selectionSet = input.selectionSet;
    }
    Model.prototype.setSelectionSet = function (selectionSet) {
        this.selectionSet = printSelectionSet(selectionSet);
    };
    Model.prototype.find = function (_a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, where = _c.where, options = _c.options, selectionSet = _c.selectionSet, _d = _c.args, args = _d === void 0 ? {} : _d, _e = _c.context, context = _e === void 0 ? {} : _e, _f = _c.rootValue, rootValue = _f === void 0 ? null : _f;
        return __awaiter(this, void 0, void 0, function () {
            var argDefinitions, argsApply, selection, query, variableValues, result;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        argDefinitions = [
                            "" + (where || options ? "(" : ""),
                            "" + (where ? "$where: " + this.name + "Where" : ""),
                            "" + (options ? "$options: " + this.name + "Options" : ""),
                            "" + (where || options ? ")" : ""),
                        ];
                        argsApply = [
                            "" + (where || options ? "(" : ""),
                            "" + (where ? "where: $where" : ""),
                            "" + (options ? "options: $options" : ""),
                            "" + (where || options ? ")" : ""),
                        ];
                        selection = printSelectionSet(selectionSet || this.selectionSet);
                        query = "\n            query " + argDefinitions.join(" ") + "{\n                " + this.camelCaseName + argsApply.join(" ") + " " + selection + "\n            }\n        ";
                        variableValues = __assign({ where: where, options: options }, args);
                        return [4 /*yield*/, graphql_1.graphql(this.neoSchema.schema, query, rootValue, context, variableValues)];
                    case 1:
                        result = _g.sent();
                        if ((_b = result.errors) === null || _b === void 0 ? void 0 : _b.length) {
                            throw new Error(result.errors[0].message);
                        }
                        return [2 /*return*/, result.data[this.camelCaseName]];
                }
            });
        });
    };
    Model.prototype.create = function (_a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, input = _c.input, selectionSet = _c.selectionSet, _d = _c.args, args = _d === void 0 ? {} : _d, _e = _c.context, context = _e === void 0 ? {} : _e, _f = _c.rootValue, rootValue = _f === void 0 ? null : _f;
        return __awaiter(this, void 0, void 0, function () {
            var mutationName, selection, mutation, variableValues, result;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        mutationName = "create" + utils_1.upperFirstLetter(this.namePluralized);
                        selection = "";
                        if (selectionSet) {
                            selection = printSelectionSet(selectionSet);
                        }
                        else {
                            selection = "\n               {\n                   " + this.camelCaseName + " \n                   " + printSelectionSet(selectionSet || this.selectionSet) + "\n               }\n           ";
                        }
                        mutation = "\n            mutation ($input: [" + this.name + "CreateInput]!){\n               " + mutationName + "(input: $input) " + selection + "\n            }\n        ";
                        variableValues = __assign(__assign({}, args), { input: input });
                        return [4 /*yield*/, graphql_1.graphql(this.neoSchema.schema, mutation, rootValue, context, variableValues)];
                    case 1:
                        result = _g.sent();
                        if ((_b = result.errors) === null || _b === void 0 ? void 0 : _b.length) {
                            throw new Error(result.errors[0].message);
                        }
                        return [2 /*return*/, result.data[mutationName]];
                }
            });
        });
    };
    Model.prototype.update = function (_a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, where = _c.where, update = _c.update, connect = _c.connect, disconnect = _c.disconnect, create = _c.create, selectionSet = _c.selectionSet, _d = _c.args, args = _d === void 0 ? {} : _d, _e = _c.context, context = _e === void 0 ? {} : _e, _f = _c.rootValue, rootValue = _f === void 0 ? null : _f;
        return __awaiter(this, void 0, void 0, function () {
            var mutationName, selection, argWorthy, argDefinitions, argsApply, mutation, variableValues, result;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        mutationName = "update" + utils_1.upperFirstLetter(this.namePluralized);
                        selection = "";
                        if (selectionSet) {
                            selection = printSelectionSet(selectionSet);
                        }
                        else {
                            selection = "\n               {\n                   " + this.camelCaseName + " \n                   " + printSelectionSet(selectionSet || this.selectionSet) + "\n               }\n           ";
                        }
                        argWorthy = where || update || connect || disconnect || create;
                        argDefinitions = [
                            "" + (argWorthy ? "(" : ""),
                            "" + (where ? "$where: " + this.name + "Where" : ""),
                            "" + (update ? "$update: " + this.name + "UpdateInput" : ""),
                            "" + (connect ? "$connect: " + this.name + "ConnectInput" : ""),
                            "" + (disconnect ? "$disconnect: " + this.name + "DisconnectInput" : ""),
                            "" + (create ? "$create: " + this.name + "RelationInput" : ""),
                            "" + (argWorthy ? ")" : ""),
                        ];
                        argsApply = [
                            "" + (argWorthy ? "(" : ""),
                            "" + (where ? "where: $where" : ""),
                            "" + (update ? "update: $update" : ""),
                            "" + (connect ? "connect: $connect" : ""),
                            "" + (disconnect ? "disconnect: $disconnect" : ""),
                            "" + (create ? "create: $create" : ""),
                            "" + (argWorthy ? ")" : ""),
                        ];
                        mutation = "\n            mutation " + argDefinitions.join(" ") + "{\n               " + mutationName + argsApply.join(" ") + "\n               " + selection + "\n            }\n        ";
                        variableValues = __assign(__assign({}, args), { where: where, update: update, connect: connect, disconnect: disconnect, create: create });
                        return [4 /*yield*/, graphql_1.graphql(this.neoSchema.schema, mutation, rootValue, context, variableValues)];
                    case 1:
                        result = _g.sent();
                        if ((_b = result.errors) === null || _b === void 0 ? void 0 : _b.length) {
                            throw new Error(result.errors[0].message);
                        }
                        return [2 /*return*/, result.data[mutationName]];
                }
            });
        });
    };
    Model.prototype.delete = function (_a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, where = _c.where, _d = _c.context, context = _d === void 0 ? {} : _d, _e = _c.rootValue, rootValue = _e === void 0 ? null : _e;
        return __awaiter(this, void 0, void 0, function () {
            var mutationName, argDefinitions, argsApply, mutation, variableValues, result;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        mutationName = "delete" + utils_1.upperFirstLetter(this.namePluralized);
                        argDefinitions = [
                            "" + (where ? "(" : ""),
                            "" + (where ? "$where: " + this.name + "Where" : ""),
                            "" + (where ? ")" : ""),
                        ];
                        argsApply = ["" + (where ? "(" : ""), "" + (where ? "where: $where" : ""), "" + (where ? ")" : "")];
                        mutation = "\n            mutation " + argDefinitions.join(" ") + "{\n               " + mutationName + argsApply.join(" ") + " {\n                   nodesDeleted\n                   relationshipsDeleted\n               }\n            }\n        ";
                        variableValues = { where: where };
                        return [4 /*yield*/, graphql_1.graphql(this.neoSchema.schema, mutation, rootValue, context, variableValues)];
                    case 1:
                        result = _f.sent();
                        if ((_b = result.errors) === null || _b === void 0 ? void 0 : _b.length) {
                            throw new Error(result.errors[0].message);
                        }
                        return [2 /*return*/, result.data[mutationName]];
                }
            });
        });
    };
    return Model;
}());
exports.default = Model;
//# sourceMappingURL=Model.js.map