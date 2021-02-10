"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
// https://stackoverflow.com/a/58632373/10687857
var _a = process.env, npm_package_version = _a.npm_package_version, npm_package_name = _a.npm_package_name;
function execute(input) {
    return __awaiter(this, void 0, void 0, function () {
        var session, debug, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = input.driver.session({ defaultAccessMode: input.defaultAccessMode });
                    // @ts-ignore
                    input.driver._userAgent = npm_package_version + "/" + npm_package_name;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 6]);
                    if (input.neoSchema.options.debug) {
                        debug = console.log;
                        if (typeof input.neoSchema.options.debug === "function") {
                            debug = input.neoSchema.options.debug;
                        }
                        debug("=======Cypher=======");
                        debug(input.cypher);
                        debug("=======Params=======");
                        debug(JSON.stringify(input.params, null, 2));
                    }
                    return [4 /*yield*/, session[input.defaultAccessMode.toLowerCase() + "Transaction"](function (tx) {
                            return tx.run(input.cypher, input.params);
                        })];
                case 2:
                    result = _a.sent();
                    if (input.statistics) {
                        return [2 /*return*/, result.summary.updateStatistics._stats];
                    }
                    if (input.raw) {
                        return [2 /*return*/, result];
                    }
                    return [2 /*return*/, result.records.map(function (r) { return r.toObject(); })];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.message.includes("Caused by: java.lang.RuntimeException: " + constants_1.AUTH_FORBIDDEN_ERROR)) {
                        throw new Error("Forbidden");
                    }
                    if (error_1.message.includes("Caused by: java.lang.RuntimeException: " + constants_1.AUTH_UNAUTHENTICATED_ERROR)) {
                        throw new Error("Unauthenticated");
                    }
                    throw error_1;
                case 4: return [4 /*yield*/, session.close()];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.default = execute;
//# sourceMappingURL=execute.js.map