"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jGraphQLAuthenticationError = exports.Neo4jGraphQLForbiddenError = exports.Neo4jGraphQLError = void 0;
/* eslint-disable max-classes-per-file */
var Neo4jGraphQLError = /** @class */ (function (_super) {
    __extends(Neo4jGraphQLError, _super);
    function Neo4jGraphQLError(message) {
        var _this = _super.call(this, message) || this;
        // if no name provided, use the default. defineProperty ensures that it stays non-enumerable
        if (!_this.name) {
            Object.defineProperty(_this, "name", { value: "Neo4jGraphQLError" });
        }
        return _this;
    }
    return Neo4jGraphQLError;
}(Error));
exports.Neo4jGraphQLError = Neo4jGraphQLError;
var Neo4jGraphQLForbiddenError = /** @class */ (function (_super) {
    __extends(Neo4jGraphQLForbiddenError, _super);
    function Neo4jGraphQLForbiddenError(message) {
        var _this = _super.call(this, message) || this;
        Object.defineProperty(_this, "name", { value: "Neo4jGraphQLForbiddenError" });
        return _this;
    }
    return Neo4jGraphQLForbiddenError;
}(Neo4jGraphQLError));
exports.Neo4jGraphQLForbiddenError = Neo4jGraphQLForbiddenError;
var Neo4jGraphQLAuthenticationError = /** @class */ (function (_super) {
    __extends(Neo4jGraphQLAuthenticationError, _super);
    function Neo4jGraphQLAuthenticationError(message) {
        var _this = _super.call(this, message) || this;
        Object.defineProperty(_this, "name", { value: "Neo4jGraphQLAuthenticationError" });
        return _this;
    }
    return Neo4jGraphQLAuthenticationError;
}(Neo4jGraphQLError));
exports.Neo4jGraphQLAuthenticationError = Neo4jGraphQLAuthenticationError;
//# sourceMappingURL=Error.js.map