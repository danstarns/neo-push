import { Context, Node } from "../classes";
declare function createCreateAndParams({ input, varName, node, context, withVars, }: {
    input: any;
    varName: string;
    node: Node;
    context: Context;
    withVars: string[];
}): [string, any];
export default createCreateAndParams;
