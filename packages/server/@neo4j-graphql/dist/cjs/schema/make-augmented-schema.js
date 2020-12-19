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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var graphql_1 = require("graphql");
var graphql_compose_1 = require("graphql-compose");
var schema_1 = require("@graphql-tools/schema");
var pluralize_1 = __importDefault(require("pluralize"));
var classes_1 = require("../classes");
var get_field_type_meta_1 = __importDefault(require("./get-field-type-meta"));
var get_cypher_meta_1 = __importDefault(require("./get-cypher-meta"));
var get_auth_1 = __importDefault(require("./get-auth"));
var get_relationship_meta_1 = __importDefault(require("./get-relationship-meta"));
var utils_1 = require("../utils");
var find_1 = __importDefault(require("./find"));
var create_1 = __importDefault(require("./create"));
var delete_1 = __importDefault(require("./delete"));
var cypher_resolver_1 = __importDefault(require("./cypher-resolver"));
var update_1 = __importDefault(require("./update"));
var merge_extensions_into_ast_1 = __importDefault(require("./merge-extensions-into-ast"));
var parse_value_node_1 = __importDefault(require("./parse-value-node"));
var merge_typedefs_1 = __importDefault(require("./merge-typedefs"));
var check_node_implements_interfaces_1 = __importDefault(require("./check-node-implements-interfaces"));
function getObjFieldMeta(_a) {
    var _b;
    var obj = _a.obj, objects = _a.objects, interfaces = _a.interfaces, scalars = _a.scalars, unions = _a.unions, enums = _a.enums;
    return (_b = obj === null || obj === void 0 ? void 0 : obj.fields) === null || _b === void 0 ? void 0 : _b.reduce(function (res, field) {
        var _a;
        var relationshipMeta = get_relationship_meta_1.default(field);
        var cypherMeta = get_cypher_meta_1.default(field);
        var typeMeta = get_field_type_meta_1.default(field);
        var fieldInterface = interfaces.find(function (x) { return x.name.value === typeMeta.name; });
        var fieldUnion = unions.find(function (x) { return x.name.value === typeMeta.name; });
        var fieldScalar = scalars.find(function (x) { return x.name.value === typeMeta.name; });
        var fieldEnum = enums.find(function (x) { return x.name.value === typeMeta.name; });
        var fieldObject = objects.find(function (x) { return x.name.value === typeMeta.name; });
        var baseField = {
            fieldName: field.name.value,
            typeMeta: typeMeta,
            otherDirectives: (field.directives || []).filter(function (x) { return !["relationship", "cypher"].includes(x.name.value); }),
            arguments: __spread((field.arguments || [])),
        };
        if (relationshipMeta) {
            if (fieldInterface) {
                throw new Error("cannot have interface on relationship");
            }
            var relationField = __assign(__assign({}, baseField), relationshipMeta);
            if (fieldUnion) {
                var nodes_1 = [];
                (_a = fieldUnion.types) === null || _a === void 0 ? void 0 : _a.forEach(function (type) {
                    var node = objects.find(function (x) { return x.name.value === type.name.value; });
                    if (!node) {
                        throw new Error("relationship union type " + type.name.value + " must be an object type");
                    }
                    nodes_1.push(type.name.value);
                });
                var unionField = __assign(__assign({}, baseField), { nodes: nodes_1 });
                relationField.union = unionField;
            }
            res.relationFields.push(relationField);
        }
        else if (cypherMeta) {
            var cypherField = __assign(__assign({}, baseField), cypherMeta);
            res.cypherFields.push(cypherField);
        }
        else if (fieldScalar) {
            var scalarField = __assign({}, baseField);
            res.scalarFields.push(scalarField);
        }
        else if (fieldEnum) {
            var enumField = __assign({}, baseField);
            res.enumFields.push(enumField);
        }
        else if (fieldUnion) {
            var unionField = __assign({}, baseField);
            res.unionFields.push(unionField);
        }
        else if (fieldInterface) {
            var interfaceField = __assign({}, baseField);
            res.interfaceFields.push(interfaceField);
        }
        else if (fieldObject) {
            var objectField = __assign({}, baseField);
            res.objectFields.push(objectField);
        }
        else {
            var primitiveField = __assign({}, baseField);
            res.primitiveFields.push(primitiveField);
        }
        return res;
    }, {
        relationFields: [],
        primitiveFields: [],
        cypherFields: [],
        scalarFields: [],
        enumFields: [],
        unionFields: [],
        interfaceFields: [],
        objectFields: [],
    });
}
function objectFieldsToComposeFields(fields) {
    return fields.reduce(function (res, field) {
        var _a;
        var newField = {
            type: field.typeMeta.pretty,
            args: {},
        };
        if (field.otherDirectives.length) {
            newField.extensions = {
                directives: field.otherDirectives.map(function (directive) {
                    var _a;
                    return ({
                        args: (_a = (directive.arguments || [])) === null || _a === void 0 ? void 0 : _a.reduce(function (r, d) {
                            var _a;
                            return (__assign(__assign({}, r), (_a = {}, _a[d.name.value] = parse_value_node_1.default(d.value), _a)));
                        }, {}),
                        name: directive.name.value,
                    });
                }),
            };
        }
        if (field.arguments) {
            newField.args = field.arguments.reduce(function (args, arg) {
                var _a;
                var meta = get_field_type_meta_1.default(arg);
                return __assign(__assign({}, args), (_a = {}, _a[arg.name.value] = {
                    type: meta.pretty,
                    description: arg.description,
                    defaultValue: arg.defaultValue,
                }, _a));
            }, {});
        }
        return __assign(__assign({}, res), (_a = {}, _a[field.fieldName] = newField, _a));
    }, {});
}
function makeAugmentedSchema(options) {
    var document = merge_extensions_into_ast_1.default(merge_typedefs_1.default(options.typeDefs));
    var composer = new graphql_compose_1.SchemaComposer();
    var neoSchema;
    // @ts-ignore
    var neoSchemaInput = {
        options: options,
    };
    composer.createObjectTC({
        name: "DeleteInfo",
        fields: {
            nodesDeleted: "Int!",
            relationshipsDeleted: "Int!",
        },
    });
    var queryOptions = composer.createInputTC({
        name: "QueryOptions",
        fields: {
            skip: "Int",
            limit: "Int",
        },
    });
    var customResolvers = (document.definitions || []).reduce(function (res, definition) {
        if (definition.kind !== "ObjectTypeDefinition") {
            return res;
        }
        if (!["Query", "Mutation", "Subscription"].includes(definition.name.value)) {
            return res;
        }
        var cypherOnes = (definition.fields || []).filter(function (field) { return field.directives && field.directives.find(function (direc) { return direc.name.value === "cypher"; }); });
        var normalOnes = (definition.fields || []).filter(function (field) {
            return (field.directives && !field.directives.find(function (direc) { return direc.name.value === "cypher"; })) ||
                !field.directives;
        });
        if (definition.name.value === "Query") {
            if (cypherOnes.length) {
                res.customCypherQuery = __assign(__assign({}, definition), { fields: cypherOnes });
            }
            if (normalOnes.length) {
                res.customQuery = __assign(__assign({}, definition), { fields: normalOnes });
            }
        }
        if (definition.name.value === "Mutation") {
            if (cypherOnes.length) {
                res.customCypherMutation = __assign(__assign({}, definition), { fields: cypherOnes });
            }
            if (normalOnes.length) {
                res.customMutation = __assign(__assign({}, definition), { fields: normalOnes });
            }
        }
        if (definition.name.value === "Subscription") {
            if (normalOnes.length) {
                res.customSubscription = __assign(__assign({}, definition), { fields: normalOnes });
            }
        }
        return res;
    }, {});
    var scalars = document.definitions.filter(function (x) { return x.kind === "ScalarTypeDefinition"; });
    var objectNodes = document.definitions.filter(function (x) { return x.kind === "ObjectTypeDefinition" && !["Query", "Mutation", "Subscription"].includes(x.name.value); });
    var enums = document.definitions.filter(function (x) { return x.kind === "EnumTypeDefinition"; });
    var inputs = document.definitions.filter(function (x) { return x.kind === "InputObjectTypeDefinition"; });
    var interfaces = document.definitions.filter(function (x) { return x.kind === "InterfaceTypeDefinition"; });
    var directives = document.definitions.filter(function (x) { return x.kind === "DirectiveDefinition"; });
    var unions = document.definitions.filter(function (x) { return x.kind === "UnionTypeDefinition"; });
    var nodes = objectNodes.map(function (definition) {
        check_node_implements_interfaces_1.default(definition, interfaces);
        var otherDirectives = (definition.directives || []).filter(function (x) { return x.name.value !== "auth"; });
        var authDirective = (definition.directives || []).find(function (x) { return x.name.value === "auth"; });
        var nodeInterfaces = __spread((definition.interfaces || []));
        var auth;
        if (authDirective) {
            auth = get_auth_1.default(authDirective);
        }
        var nodeFields = getObjFieldMeta({
            obj: definition,
            enums: enums,
            interfaces: interfaces,
            scalars: scalars,
            unions: unions,
            objects: objectNodes,
        });
        var node = new classes_1.Node(__assign(__assign({ name: definition.name.value, interfaces: nodeInterfaces, otherDirectives: otherDirectives }, nodeFields), { 
            // @ts-ignore
            auth: auth, getGraphQLSchema: function () { return neoSchemaInput.schema; } }));
        return node;
    });
    var nodeNames = nodes.map(function (x) { return x.name; });
    neoSchemaInput.nodes = nodes;
    neoSchemaInput.nodes.forEach(function (node) {
        var _a, _b, _c;
        var nodeFields = objectFieldsToComposeFields(__spread(node.primitiveFields, node.cypherFields, node.enumFields, node.scalarFields, node.interfaceFields, node.objectFields, node.unionFields));
        var composeNode = composer.createObjectTC({
            name: node.name,
            fields: nodeFields,
            extensions: {
                directives: node.otherDirectives.map(function (directive) {
                    var _a;
                    return ({
                        args: (_a = (directive.arguments || [])) === null || _a === void 0 ? void 0 : _a.reduce(function (r, d) {
                            var _a;
                            return (__assign(__assign({}, r), (_a = {}, _a[d.name.value] = parse_value_node_1.default(d.value), _a)));
                        }, {}),
                        name: directive.name.value,
                    });
                }),
            },
            interfaces: node.interfaces.map(function (x) { return x.name.value; }),
        });
        var sortEnum = composer.createEnumTC({
            name: node.name + "Sort",
            values: __spread(node.primitiveFields, node.enumFields, node.scalarFields).reduce(function (res, f) {
                var _a;
                return __assign(__assign({}, res), (_a = {}, _a[f.fieldName + "_DESC"] = { value: f.fieldName + "_DESC" }, _a[f.fieldName + "_ASC"] = { value: f.fieldName + "_ASC" }, _a));
            }, {}),
        });
        var queryFields = __spread(node.primitiveFields, node.enumFields, node.scalarFields).reduce(function (res, f) {
            if (["ID", "String"].includes(f.typeMeta.name) || enums.find(function (x) { return x.name.value === f.typeMeta.name; })) {
                var type = f.typeMeta.name === "ID" ? "ID" : "String";
                // equality
                if (f.typeMeta.array) {
                    res[f.fieldName] = "[" + type + "]";
                }
                else {
                    res[f.fieldName] = type;
                }
                res[f.fieldName + "_IN"] = "[" + type + "]";
                res[f.fieldName + "_NOT"] = type;
                res[f.fieldName + "_NOT_IN"] = "[" + type + "]";
                res[f.fieldName + "_CONTAINS"] = type;
                res[f.fieldName + "_NOT_CONTAINS"] = type;
                res[f.fieldName + "_STARTS_WITH"] = type;
                res[f.fieldName + "_NOT_STARTS_WITH"] = type;
                res[f.fieldName + "_ENDS_WITH"] = type;
                res[f.fieldName + "_NOT_ENDS_WITH"] = type;
                res[f.fieldName + "_REGEX"] = "String";
                return res;
            }
            if (["Boolean"].includes(f.typeMeta.name)) {
                // equality
                if (f.typeMeta.array) {
                    res[f.fieldName] = "[Boolean]";
                }
                else {
                    res[f.fieldName] = "Boolean";
                }
                res[f.fieldName + "_NOT"] = "Boolean";
                return res;
            }
            if (["Float", "Int"].includes(f.typeMeta.name)) {
                if (f.typeMeta.array) {
                    res[f.fieldName] = "[" + f.typeMeta.name + "]";
                }
                else {
                    // equality
                    res[f.fieldName] = f.typeMeta.name;
                }
                res[f.fieldName + "_IN"] = "[" + f.typeMeta.name + "]";
                res[f.fieldName + "_NOT_IN"] = "[" + f.typeMeta.name + "]";
                res[f.fieldName + "_NOT"] = f.typeMeta.name;
                res[f.fieldName + "_LT"] = f.typeMeta.name;
                res[f.fieldName + "_LTE"] = f.typeMeta.name;
                res[f.fieldName + "_GT"] = f.typeMeta.name;
                res[f.fieldName + "_GTE"] = f.typeMeta.name;
                return res;
            }
            // equality
            if (f.typeMeta.array) {
                res[f.fieldName] = "[" + f.typeMeta.name + "]";
            }
            else {
                res[f.fieldName] = f.typeMeta.name;
            }
            return res;
        }, { OR: "[" + node.name + "OR]", AND: "[" + node.name + "AND]" });
        var _d = __read(["AND", "OR", "Where"].map(function (value) {
            return composer.createInputTC({
                name: "" + node.name + value,
                fields: queryFields,
            });
        }), 3), andInput = _d[0], orInput = _d[1], whereInput = _d[2];
        composer.createInputTC({
            name: node.name + "Options",
            fields: { sort: sortEnum.List, limit: "Int", skip: "Int" },
        });
        var _e = __read(["CreateInput", "UpdateInput"].map(function (type) {
            return composer.createInputTC({
                name: "" + node.name + type,
                fields: __spread(node.primitiveFields, node.scalarFields, node.enumFields).reduce(function (res, f) {
                    var _a;
                    return (__assign(__assign({}, res), (_a = {}, _a[f.fieldName] = f.typeMeta.array ? "[" + f.typeMeta.name + "]" : f.typeMeta.name, _a)));
                }, {}),
            });
        }), 2), nodeInput = _e[0], nodeUpdateInput = _e[1];
        var nodeConnectInput = undefined;
        var nodeDisconnectInput = undefined;
        var nodeRelationInput = undefined;
        if (node.relationFields.length) {
            _a = __read([
                "ConnectInput",
                "DisconnectInput",
                "RelationInput",
            ].map(function (type) {
                return composer.createInputTC({
                    name: "" + node.name + type,
                    fields: {},
                });
            }), 3), nodeConnectInput = _a[0], nodeDisconnectInput = _a[1], nodeRelationInput = _a[2];
        }
        composer.createInputTC({
            name: node.name + "ConnectFieldInput",
            fields: __assign({ where: node.name + "Where" }, (node.relationFields.length ? { connect: nodeConnectInput } : {})),
        });
        composer.createInputTC({
            name: node.name + "DisconnectFieldInput",
            fields: __assign({ where: node.name + "Where" }, (node.relationFields.length ? { disconnect: nodeDisconnectInput } : {})),
        });
        node.relationFields.forEach(function (rel) {
            var _a, _b, _c, _d, _e, _f, _g;
            if (rel.union) {
                var refNodes = neoSchemaInput.nodes.filter(function (x) { var _a, _b; return (_b = (_a = rel.union) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.includes(x.name); });
                composeNode.addFields((_a = {},
                    _a[rel.fieldName] = {
                        type: rel.typeMeta.pretty,
                        args: {
                            options: queryOptions.getTypeName(),
                        },
                    },
                    _a));
                refNodes.forEach(function (n) {
                    var _a, _b, _c, _d, _e, _f;
                    var concatFieldName = rel.fieldName + "_" + n.name;
                    var createField = rel.typeMeta.array ? "[" + n.name + "CreateInput]" : n.name + "CreateInput";
                    var updateField = n.name + "UpdateInput";
                    var nodeFieldInputName = "" + node.name + utils_1.upperFirstLetter(rel.fieldName) + n.name + "FieldInput";
                    var nodeFieldUpdateInputName = "" + node.name + utils_1.upperFirstLetter(rel.fieldName) + n.name + "UpdateFieldInput";
                    var connectField = rel.typeMeta.array
                        ? "[" + n.name + "ConnectFieldInput]"
                        : n.name + "ConnectFieldInput";
                    var disconnectField = rel.typeMeta.array
                        ? "[" + n.name + "DisconnectFieldInput]"
                        : n.name + "DisconnectFieldInput";
                    composeNode.addFieldArgs(rel.fieldName, (_a = {},
                        _a[n.name] = n.name + "Where",
                        _a));
                    composer.createInputTC({
                        name: nodeFieldUpdateInputName,
                        fields: {
                            where: n.name + "Where",
                            update: updateField,
                            connect: connectField,
                            disconnect: disconnectField,
                            create: createField,
                        },
                    });
                    composer.createInputTC({
                        name: nodeFieldInputName,
                        fields: {
                            create: createField,
                            connect: connectField,
                        },
                    });
                    nodeRelationInput.addFields((_b = {},
                        _b[concatFieldName] = createField,
                        _b));
                    nodeInput.addFields((_c = {},
                        _c[concatFieldName] = nodeFieldInputName,
                        _c));
                    nodeUpdateInput.addFields((_d = {},
                        _d[concatFieldName] = rel.typeMeta.array
                            ? "[" + nodeFieldUpdateInputName + "]"
                            : nodeFieldUpdateInputName,
                        _d));
                    nodeConnectInput.addFields((_e = {},
                        _e[concatFieldName] = connectField,
                        _e));
                    nodeDisconnectInput.addFields((_f = {},
                        _f[concatFieldName] = disconnectField,
                        _f));
                });
                return;
            }
            var n = neoSchemaInput.nodes.find(function (x) { return x.name === rel.typeMeta.name; });
            var createField = rel.typeMeta.array ? "[" + n.name + "CreateInput]" : n.name + "CreateInput";
            var updateField = n.name + "UpdateInput";
            var nodeFieldInputName = "" + node.name + utils_1.upperFirstLetter(rel.fieldName) + "FieldInput";
            var nodeFieldUpdateInputName = "" + node.name + utils_1.upperFirstLetter(rel.fieldName) + "UpdateFieldInput";
            var connectField = rel.typeMeta.array ? "[" + n.name + "ConnectFieldInput]" : n.name + "ConnectFieldInput";
            var disconnectField = rel.typeMeta.array
                ? "[" + n.name + "DisconnectFieldInput]"
                : n.name + "DisconnectFieldInput";
            [whereInput, andInput, orInput].forEach(function (inputType) {
                var _a;
                inputType.addFields((_a = {},
                    _a[rel.fieldName] = n.name + "Where",
                    _a[rel.fieldName + "_NOT"] = n.name + "Where",
                    _a[rel.fieldName + "_IN"] = "[" + n.name + "Where]",
                    _a[rel.fieldName + "_NOT_IN"] = "[" + n.name + "Where]",
                    _a));
            });
            composeNode.addFields((_b = {},
                _b[rel.fieldName] = {
                    type: rel.typeMeta.pretty,
                    args: {
                        where: rel.typeMeta.name + "Where",
                        options: rel.typeMeta.name + "Options",
                    },
                },
                _b));
            composer.createInputTC({
                name: nodeFieldUpdateInputName,
                fields: {
                    where: n.name + "Where",
                    update: updateField,
                    connect: connectField,
                    disconnect: disconnectField,
                    create: createField,
                },
            });
            composer.createInputTC({
                name: nodeFieldInputName,
                fields: {
                    create: createField,
                    connect: connectField,
                },
            });
            nodeRelationInput.addFields((_c = {},
                _c[rel.fieldName] = createField,
                _c));
            nodeInput.addFields((_d = {},
                _d[rel.fieldName] = nodeFieldInputName,
                _d));
            nodeUpdateInput.addFields((_e = {},
                _e[rel.fieldName] = rel.typeMeta.array ? "[" + nodeFieldUpdateInputName + "]" : nodeFieldUpdateInputName,
                _e));
            nodeConnectInput.addFields((_f = {},
                _f[rel.fieldName] = connectField,
                _f));
            nodeDisconnectInput.addFields((_g = {},
                _g[rel.fieldName] = disconnectField,
                _g));
        });
        composer.Query.addFields((_b = {},
            _b[pluralize_1.default(node.name)] = find_1.default({ node: node, getSchema: function () { return neoSchema; } }),
            _b));
        composer.Mutation.addFields((_c = {},
            _c["create" + pluralize_1.default(node.name)] = create_1.default({ node: node, getSchema: function () { return neoSchema; } }),
            _c["delete" + pluralize_1.default(node.name)] = delete_1.default({ node: node, getSchema: function () { return neoSchema; } }),
            _c["update" + pluralize_1.default(node.name)] = update_1.default({ node: node, getSchema: function () { return neoSchema; } }),
            _c));
    });
    ["Mutation", "Query"].forEach(function (type) {
        var objectComposer = composer[type];
        var cypherType = customResolvers["customCypher" + type];
        if (cypherType) {
            var objectFields = getObjFieldMeta({
                obj: cypherType,
                scalars: scalars,
                enums: enums,
                interfaces: interfaces,
                unions: unions,
                objects: objectNodes,
            });
            var objectComposeFields = objectFieldsToComposeFields(__spread(objectFields.enumFields, objectFields.interfaceFields, objectFields.primitiveFields, objectFields.relationFields, objectFields.scalarFields, objectFields.unionFields, objectFields.objectFields));
            objectComposer.addFields(objectComposeFields);
            objectFields.cypherFields.forEach(function (field) {
                var _a;
                var customResolver = cypher_resolver_1.default({
                    defaultAccessMode: type === "Query" ? "READ" : "WRITE",
                    field: field,
                    statement: field.statement,
                    getSchema: function () { return neoSchema; },
                });
                var composedField = objectFieldsToComposeFields([field])[field.fieldName];
                objectComposer.addFields((_a = {}, _a[field.fieldName] = __assign(__assign({}, composedField), customResolver), _a));
            });
        }
    });
    var extraDefinitions = __spread(enums, scalars, directives, inputs, unions, [
        customResolvers.customQuery,
        customResolvers.customMutation,
        customResolvers.customSubscription,
    ]).filter(Boolean);
    if (extraDefinitions.length) {
        composer.addTypeDefs(graphql_1.print({ kind: "Document", definitions: extraDefinitions }));
    }
    interfaces.forEach(function (inter) {
        var objectFields = getObjFieldMeta({ obj: inter, scalars: scalars, enums: enums, interfaces: interfaces, unions: unions, objects: objectNodes });
        var objectComposeFields = objectFieldsToComposeFields(Object.values(objectFields).reduce(function (acc, x) { return __spread(acc, x); }, []));
        composer.createInterfaceTC({
            name: inter.name.value,
            fields: objectComposeFields,
            extensions: {
                directives: (inter.directives || [])
                    .filter(function (x) { return x.name.value !== "auth"; })
                    .map(function (directive) {
                    var _a;
                    return ({
                        args: (_a = (directive.arguments || [])) === null || _a === void 0 ? void 0 : _a.reduce(function (r, d) {
                            var _a;
                            return (__assign(__assign({}, r), (_a = {}, _a[d.name.value] = parse_value_node_1.default(d.value), _a)));
                        }, {}),
                        name: directive.name.value,
                    });
                }),
            },
        });
    });
    var generatedTypeDefs = composer.toSDL();
    var generatedResolvers = composer.getResolveMethods();
    unions.forEach(function (union) {
        generatedResolvers[union.name.value] = { __resolveType: function (root) { return root.__resolveType; } };
    });
    if (options.resolvers) {
        var _a = options.resolvers, _b = _a.Query, customQueries = _b === void 0 ? {} : _b, _c = _a.Mutation, customMutations = _c === void 0 ? {} : _c, _d = _a.Subscription, customSubscriptions = _d === void 0 ? {} : _d, rest = __rest(_a, ["Query", "Mutation", "Subscription"]);
        if (customQueries) {
            if (generatedResolvers.Query) {
                generatedResolvers.Query = __assign(__assign({}, generatedResolvers.Query), customQueries);
            }
            else {
                generatedResolvers.Query = customQueries;
            }
        }
        if (customMutations) {
            if (generatedResolvers.Mutation) {
                generatedResolvers.Mutation = __assign(__assign({}, generatedResolvers.Mutation), customMutations);
            }
            else {
                generatedResolvers.Mutation = customMutations;
            }
        }
        if (Object.keys(customSubscriptions).length) {
            generatedResolvers.Subscription = customSubscriptions;
        }
        var typeResolvers = Object.entries(rest).reduce(function (r, entry) {
            var _a;
            var _b = __read(entry, 2), key = _b[0], value = _b[1];
            if (!nodeNames.includes(key)) {
                return r;
            }
            return __assign(__assign({}, r), (_a = {}, _a[key] = __assign(__assign({}, generatedResolvers[key]), value), _a));
        }, {});
        generatedResolvers = __assign(__assign({}, generatedResolvers), typeResolvers);
        var otherResolvers = Object.entries(rest).reduce(function (r, entry) {
            var _a;
            var _b = __read(entry, 2), key = _b[0], value = _b[1];
            if (nodeNames.includes(key)) {
                return r;
            }
            return __assign(__assign({}, r), (_a = {}, _a[key] = value, _a));
        }, {});
        generatedResolvers = __assign(__assign({}, generatedResolvers), otherResolvers);
    }
    neoSchemaInput.typeDefs = generatedTypeDefs;
    neoSchemaInput.resolvers = generatedResolvers;
    neoSchemaInput.schema = schema_1.makeExecutableSchema({
        typeDefs: generatedTypeDefs,
        resolvers: generatedResolvers,
        schemaDirectives: options.schemaDirectives,
    });
    neoSchema = new classes_1.NeoSchema(neoSchemaInput);
    return neoSchema;
}
exports.default = makeAugmentedSchema;
//# sourceMappingURL=make-augmented-schema.js.map