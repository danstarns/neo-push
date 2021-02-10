import { DirectiveNode, NamedTypeNode } from "graphql";
import { RelationField, CypherField, PrimitiveField, CustomEnumField, CustomScalarField, UnionField, InterfaceField, ObjectField, DateTimeField, PointField, Auth } from "../types";
import Exclude from "./Exclude";
export interface NodeConstructor {
    name: string;
    relationFields: RelationField[];
    cypherFields: CypherField[];
    primitiveFields: PrimitiveField[];
    scalarFields: CustomScalarField[];
    enumFields: CustomEnumField[];
    otherDirectives: DirectiveNode[];
    unionFields: UnionField[];
    interfaceFields: InterfaceField[];
    interfaces: NamedTypeNode[];
    objectFields: ObjectField[];
    dateTimeFields: DateTimeField[];
    pointFields: PointField[];
    auth?: Auth;
    exclude?: Exclude;
    description?: string;
}
declare class Node {
    name: string;
    relationFields: RelationField[];
    cypherFields: CypherField[];
    primitiveFields: PrimitiveField[];
    scalarFields: CustomScalarField[];
    enumFields: CustomEnumField[];
    otherDirectives: DirectiveNode[];
    unionFields: UnionField[];
    interfaceFields: InterfaceField[];
    interfaces: NamedTypeNode[];
    objectFields: ObjectField[];
    dateTimeFields: DateTimeField[];
    pointFields: PointField[];
    exclude?: Exclude;
    auth?: Auth;
    description?: string;
    authableFields: (PrimitiveField | CustomScalarField | CustomEnumField | UnionField | ObjectField | DateTimeField | PointField | CypherField)[];
    settableFields: (PrimitiveField | CustomScalarField | CustomEnumField | UnionField | ObjectField | DateTimeField | PointField)[];
    constructor(input: NodeConstructor);
}
export default Node;
