"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var deep_equal_1 = __importDefault(require("deep-equal"));
function stripLoc(obj) {
    return JSON.parse(JSON.stringify(obj, function (key, value) {
        if (key === "loc") {
            return undefined;
        }
        return value;
    }));
}
function checkNodeImplementsInterfaces(node, interfaces) {
    var _a;
    if (!((_a = node.interfaces) === null || _a === void 0 ? void 0 : _a.length)) {
        return;
    }
    node.interfaces.forEach(function (inter) {
        var _a, _b;
        var error = new Error("type " + node.name.value + " does not implement interface " + inter.name.value + " correctly");
        var interDefinition = interfaces.find(function (x) { return x.name.value === inter.name.value; });
        if (!interDefinition) {
            throw error;
        }
        (_a = interDefinition.directives) === null || _a === void 0 ? void 0 : _a.forEach(function (interDirec) {
            var _a;
            var nodeDirec = (_a = node.directives) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.name.value === interDirec.name.value; });
            if (!nodeDirec) {
                throw error;
            }
            var isEqual = deep_equal_1.default(stripLoc(nodeDirec), stripLoc(interDirec));
            if (!isEqual) {
                throw error;
            }
        });
        (_b = interDefinition.fields) === null || _b === void 0 ? void 0 : _b.forEach(function (interField) {
            var _a;
            var nodeField = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.name.value === interField.name.value; });
            if (!nodeField) {
                throw error;
            }
            var isEqual = deep_equal_1.default(stripLoc(nodeField), stripLoc(interField));
            if (!isEqual) {
                throw error;
            }
        });
    });
}
exports.default = checkNodeImplementsInterfaces;
//# sourceMappingURL=check-node-implements-interfaces.js.map