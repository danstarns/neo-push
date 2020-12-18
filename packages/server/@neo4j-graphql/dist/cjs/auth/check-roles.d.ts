import { Node, Context } from "../classes";
import { AuthOperations } from "../types";
declare function checkRoles({ node, context, operation }: {
    node: Node;
    context: Context;
    operation: AuthOperations;
}): void;
export default checkRoles;
