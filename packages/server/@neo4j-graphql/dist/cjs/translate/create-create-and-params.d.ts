import { Context, Node } from "../classes";
declare function createCreateAndParams({ input, varName, node, context, withVars, insideDoWhen, }: {
    input: any;
    varName: string;
    node: Node;
    context: Context;
    withVars: string[];
    insideDoWhen?: boolean;
}): [string, any];
export default createCreateAndParams;
