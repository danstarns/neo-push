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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_field_type_meta_1 = __importDefault(require("./get-field-type-meta"));
var parse_value_node_1 = __importDefault(require("./parse-value-node"));
function graphqlArgsToCompose(args) {
    return args.reduce(function (res, arg) {
        var _a;
        var meta = get_field_type_meta_1.default(arg);
        return __assign(__assign({}, res), (_a = {}, _a[arg.name.value] = __assign({ type: meta.pretty, description: arg.description }, (arg.defaultValue ? { defaultValue: parse_value_node_1.default(arg.defaultValue) } : {})), _a));
    }, {});
}
exports.default = graphqlArgsToCompose;
//# sourceMappingURL=graphql-arg-to-compose.js.map