import { AuthRule, Context, Node } from "../classes";
import { AuthOperations } from "../types";
declare function createAllowAndParams({ varName, node, chainStr, context, functionType, recurseArray, operation, chainStrOverRide, }: {
    node: Node;
    context: Context;
    varName: string;
    chainStr?: string;
    functionType?: boolean;
    recurseArray?: AuthRule[];
    operation: AuthOperations;
    chainStrOverRide?: string;
}): [string, any];
export default createAllowAndParams;
