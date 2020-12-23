import { AuthRule, Context, Node } from "../classes";
import { AuthOperations } from "../types";
declare function createAuthAndParams({ varName, node, chainStr, context, functionType, recurseArray, operation, chainStrOverRide, type, }: {
    node: Node;
    context: Context;
    varName: string;
    chainStr?: string;
    functionType?: boolean;
    recurseArray?: AuthRule[];
    operation: AuthOperations;
    chainStrOverRide?: string;
    type: "bind" | "allow";
}): [string, any];
export default createAuthAndParams;
