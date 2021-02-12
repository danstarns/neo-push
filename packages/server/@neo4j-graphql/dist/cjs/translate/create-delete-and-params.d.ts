import { Node, Context } from "../classes";
declare function createDeleteAndParams({ deleteInput, varName, node, parentVar, chainStr, withVars, context, insideDoWhen, }: {
    parentVar: string;
    deleteInput: any;
    varName: string;
    chainStr?: string;
    node: Node;
    withVars: string[];
    context: Context;
    insideDoWhen?: boolean;
}): [string, any];
export default createDeleteAndParams;
