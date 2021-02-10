import { FieldsByTypeName } from "graphql-parse-resolve-info";
import { Context, Node } from "../classes";
interface ProjectionMeta {
    authStrs: string[];
}
declare function createProjectionAndParams({ fieldsByTypeName, node, context, chainStr, varName, chainStrOverRide, }: {
    fieldsByTypeName: FieldsByTypeName;
    node: Node;
    context: Context;
    chainStr?: string;
    varName: string;
    chainStrOverRide?: string;
}): [string, any, ProjectionMeta?];
export default createProjectionAndParams;
