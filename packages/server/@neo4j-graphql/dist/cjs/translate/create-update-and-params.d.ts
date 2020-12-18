import { Node, Context } from "../classes";
declare function createUpdateAndParams({ updateInput, varName, node, parentVar, chainStr, insideDoWhen, withVars, context, }: {
    parentVar: string;
    updateInput: any;
    varName: string;
    chainStr?: string;
    node: Node;
    withVars: string[];
    insideDoWhen?: boolean;
    context: Context;
}): [string, any];
export default createUpdateAndParams;
