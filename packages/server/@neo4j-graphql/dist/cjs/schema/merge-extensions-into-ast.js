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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-restricted-syntax */
var graphql_1 = require("graphql");
function getKindInfo(def) {
    switch (def.kind) {
        case graphql_1.Kind.SCHEMA_DEFINITION: {
            return {
                isExtension: false,
                typeName: "schema",
            };
        }
        case graphql_1.Kind.SCALAR_TYPE_DEFINITION: {
            return {
                isExtension: false,
                typeName: "scalar " + def.name.value,
            };
        }
        case graphql_1.Kind.OBJECT_TYPE_DEFINITION: {
            return {
                isExtension: false,
                typeName: "type " + def.name.value,
            };
        }
        case graphql_1.Kind.INTERFACE_TYPE_DEFINITION: {
            return {
                isExtension: false,
                typeName: "interface " + def.name.value,
            };
        }
        case graphql_1.Kind.UNION_TYPE_DEFINITION: {
            return {
                isExtension: false,
                typeName: "union " + def.name.value,
            };
        }
        case graphql_1.Kind.ENUM_TYPE_DEFINITION: {
            return {
                isExtension: false,
                typeName: "enum " + def.name.value,
            };
        }
        case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION: {
            return {
                isExtension: false,
                typeName: "input " + def.name.value,
            };
        }
        case graphql_1.Kind.DIRECTIVE_DEFINITION: {
            return {
                isExtension: false,
                typeName: "directive " + def.name.value,
            };
        }
        case graphql_1.Kind.SCHEMA_EXTENSION: {
            return {
                isExtension: true,
                typeName: "schema",
            };
        }
        case graphql_1.Kind.SCALAR_TYPE_EXTENSION: {
            return {
                isExtension: true,
                typeName: "scalar " + def.name.value,
            };
        }
        case graphql_1.Kind.OBJECT_TYPE_EXTENSION: {
            return {
                isExtension: true,
                typeName: "type " + def.name.value,
            };
        }
        case graphql_1.Kind.INTERFACE_TYPE_EXTENSION: {
            return {
                isExtension: true,
                typeName: "interface " + def.name.value,
            };
        }
        case graphql_1.Kind.UNION_TYPE_EXTENSION: {
            return {
                isExtension: true,
                typeName: "union " + def.name.value,
            };
        }
        case graphql_1.Kind.ENUM_TYPE_EXTENSION: {
            return {
                isExtension: true,
                typeName: "enum " + def.name.value,
            };
        }
        case graphql_1.Kind.INPUT_OBJECT_TYPE_EXTENSION: {
            return {
                isExtension: true,
                typeName: "input " + def.name.value,
            };
        }
        default: {
            throw new Error("something went wrong");
        }
    }
}
function mergeFields(fields, extFields) {
    if (fields === void 0) { fields = []; }
    if (extFields === void 0) { extFields = []; }
    var result = __spread(fields);
    extFields.forEach(function (extField) {
        var existingIndex = result.findIndex(function (x) { return x.name.value === extField.name.value; });
        if (existingIndex !== -1) {
            var existing = result[existingIndex];
            result[existingIndex] = __assign(__assign(__assign({}, existing), extField), { directives: __spread((existing.directives ? existing.directives : []), (extField.directives ? extField.directives : [])) });
        }
        else {
            result.push(extField);
        }
    });
    return result;
}
function extendDefinition(def, ext) {
    var extendLocation = function (loc, loc2) { return (__assign(__assign({}, loc), { ext: loc.ext ? __spread(loc.ext, [loc2]) : [loc2] })); };
    // @ts-ignore
    var directives = __spread((def.directives || []), (ext.directives || []));
    // @ts-ignore
    var fields = mergeFields(def.fields, ext.fields);
    var loc = extendLocation(def.loc, ext.loc);
    switch (def.kind) {
        case graphql_1.Kind.SCHEMA_DEFINITION: {
            return __assign(__assign({}, def), { directives: directives, operationTypes: __spread(def.operationTypes, ext.operationTypes), loc: loc });
        }
        case graphql_1.Kind.SCALAR_TYPE_DEFINITION: {
            return __assign(__assign({}, def), { directives: directives,
                loc: loc });
        }
        case graphql_1.Kind.OBJECT_TYPE_DEFINITION: {
            return __assign(__assign({}, def), { interfaces: __spread((def.interfaces || []), (ext.interfaces || [])), directives: directives,
                fields: fields,
                loc: loc });
        }
        case graphql_1.Kind.INTERFACE_TYPE_DEFINITION: {
            return __assign(__assign({}, def), { directives: directives,
                fields: fields,
                loc: loc });
        }
        case graphql_1.Kind.UNION_TYPE_DEFINITION: {
            return __assign(__assign({}, def), { directives: directives, types: __spread((def.types || []), (ext.types || [])), loc: loc });
        }
        case graphql_1.Kind.ENUM_TYPE_DEFINITION: {
            return __assign(__assign({}, def), { directives: directives, values: __spread((def.values || []), (ext.values || [])), loc: loc });
        }
        case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION: {
            return __assign(__assign({}, def), { directives: directives,
                fields: fields,
                loc: loc });
        }
        default: {
            return def;
        }
    }
}
function mergeExtensionsIntoAST(document) {
    var e_1, _a;
    var definitions = new Map();
    var extensions = new Map();
    document.definitions.forEach(function (def) {
        var _a = getKindInfo(def), isExtension = _a.isExtension, typeName = _a.typeName;
        if (isExtension) {
            if (extensions.has(typeName)) {
                extensions.get(typeName).push(def);
            }
            else {
                extensions.set(typeName, [def]);
            }
        }
        else {
            definitions.set(typeName, def);
        }
    });
    try {
        for (var extensions_1 = __values(extensions), extensions_1_1 = extensions_1.next(); !extensions_1_1.done; extensions_1_1 = extensions_1.next()) {
            var _b = __read(extensions_1_1.value, 2), key = _b[0], extDefs = _b[1];
            var def = definitions.get(key);
            definitions.set(key, extDefs.reduce(extendDefinition, def));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (extensions_1_1 && !extensions_1_1.done && (_a = extensions_1.return)) _a.call(extensions_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return __assign(__assign({}, document), { definitions: __spread(definitions.values()) });
}
exports.default = mergeExtensionsIntoAST;
//# sourceMappingURL=merge-extensions-into-ast.js.map