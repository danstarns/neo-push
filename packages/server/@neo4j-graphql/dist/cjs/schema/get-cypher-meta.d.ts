import { FieldDefinitionNode } from "graphql";
declare type CypherMeta = {
    statement: string;
};
declare function getCypherMeta(field: FieldDefinitionNode): CypherMeta | undefined;
export default getCypherMeta;
