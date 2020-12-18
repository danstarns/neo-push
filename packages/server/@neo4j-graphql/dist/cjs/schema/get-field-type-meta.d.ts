import { FieldDefinitionNode, InputValueDefinitionNode } from "graphql";
import { TypeMeta } from "../types";
declare function getFieldTypeMeta(field: FieldDefinitionNode | InputValueDefinitionNode): TypeMeta;
export default getFieldTypeMeta;
