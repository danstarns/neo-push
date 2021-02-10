"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getName(type) {
    return type.kind === "NamedType" ? type.name.value : getName(type.type);
}
function getPrettyName(type) {
    var result;
    switch (type.kind) {
        case "NamedType":
            result = type.name.value;
            break;
        case "NonNullType":
            result = getPrettyName(type.type) + "!";
            break;
        case "ListType":
            result = "[" + getPrettyName(type.type) + "]";
            break;
    }
    return result;
}
function getFieldTypeMeta(field) {
    var name = getName(field.type);
    var prettyName = getPrettyName(field.type);
    var array = /\[.+\]/g.test(prettyName);
    var inputName = "" + (["Point", "CartesianPoint"].includes(name) ? name + "Input" : name);
    return {
        name: name,
        array: array,
        required: prettyName.includes("!"),
        pretty: prettyName,
        input: {
            name: inputName,
            pretty: "" + (array ? "[" : "") + inputName + (array ? "]" : ""),
        },
    };
}
exports.default = getFieldTypeMeta;
//# sourceMappingURL=get-field-type-meta.js.map