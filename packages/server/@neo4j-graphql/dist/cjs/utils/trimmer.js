"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Replace all \n with a space & replace all spaces > 1 with a single space
function trimmer(str) {
    return str.replace(/\n/g, " ").replace(/\s\s+/g, " ").trim();
}
exports.default = trimmer;
//# sourceMappingURL=trimmer.js.map