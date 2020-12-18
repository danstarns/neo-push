"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var auth_1 = require("../auth");
var Context = /** @class */ (function () {
    function Context(input) {
        this.graphQLContext = input.graphQLContext;
        this.neoSchema = input.neoSchema;
        this.driver = input.driver;
    }
    Context.prototype.getJWT = function () {
        if (this.jwt) {
            return this.jwt;
        }
        var req = this.graphQLContext instanceof http_1.IncomingMessage
            ? this.graphQLContext
            : this.graphQLContext.req || this.graphQLContext.request;
        if (!req ||
            !req.headers ||
            (!req.headers.authorization && !req.headers.Authorization) ||
            (!req && !req.cookies && !req.cookies.token)) {
            return false;
        }
        var authorization = req.headers.authorization || req.headers.Authorization || req.cookies.token || "";
        var _a = __read(authorization.split("Bearer "), 2), _ = _a[0], token = _a[1];
        if (!token) {
            return false;
        }
        var jwt = auth_1.verifyAndDecodeToken(token);
        this.jwt = jwt;
        return jwt;
    };
    return Context;
}());
exports.default = Context;
//# sourceMappingURL=Context.js.map