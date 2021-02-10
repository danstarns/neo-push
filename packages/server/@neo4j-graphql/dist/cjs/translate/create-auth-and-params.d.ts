import { Context, Node } from "../classes";
import { AuthOperations, BaseField } from "../types";
interface Allow {
    varName: string;
    parentNode: Node;
    chainStr?: string;
}
interface Bind {
    varName: string;
    parentNode: Node;
    chainStr?: string;
}
declare function createAuthAndParams({ entity, operation, skipRoles, skipIsAuthenticated, allow, context, escapeQuotes, bind, }: {
    entity: Node | BaseField;
    operation?: AuthOperations;
    skipRoles?: boolean;
    skipIsAuthenticated?: boolean;
    allow?: Allow;
    context: Context;
    escapeQuotes?: boolean;
    bind?: Bind;
}): [string, any];
export default createAuthAndParams;
