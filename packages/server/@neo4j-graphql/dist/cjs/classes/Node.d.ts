import { DirectiveNode, NamedTypeNode, GraphQLSchema } from "graphql";
import { RelationField, CypherField, PrimitiveField, CustomEnumField, CustomScalarField, UnionField, InterfaceField, ObjectField, DateTimeField } from "../types";
import Auth from "./Auth";
import Model from "./Model";
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
    auth?: Auth;
    timestamps?: boolean;
    getGraphQLSchema: () => GraphQLSchema;
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
    auth?: Auth;
    timestamps?: boolean;
    model: Model;
    constructor(input: NodeConstructor);
}
export default Node;
