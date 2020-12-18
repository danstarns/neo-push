import { DirectiveNode, NamedTypeNode, GraphQLSchema } from "graphql";
import { RelationField, CypherField, PrimitiveField, CustomEnumField, CustomScalarField, UnionField, InterfaceField, ObjectField } from "../types";
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
    auth?: Auth;
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
    auth?: Auth;
    model: Model;
    constructor(input: NodeConstructor);
}
export default Node;
