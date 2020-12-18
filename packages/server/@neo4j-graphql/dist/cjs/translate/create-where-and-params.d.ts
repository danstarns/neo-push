import { GraphQLWhereArg } from "../types";
import { Context, Node } from "../classes";
declare function createWhereAndParams({ whereInput, varName, chainStr, node, context, recursing, chainStrOverRide, }: {
    node: Node;
    context: Context;
    whereInput: GraphQLWhereArg;
    varName: string;
    chainStr?: string;
    recursing?: boolean;
    chainStrOverRide?: string;
}): [string, any];
export default createWhereAndParams;
