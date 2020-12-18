import { FieldDefinitionNode } from "graphql";
declare type RelationshipMeta = {
    direction: "IN" | "OUT";
    type: string;
};
declare function getRelationshipMeta(field: FieldDefinitionNode): RelationshipMeta | undefined;
export default getRelationshipMeta;
