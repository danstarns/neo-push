import { Context, Node } from "../classes";
import { RelationField } from "../types";
declare function createConnectAndParams({ withVars, value, varName, relationField, parentVar, refNode, context, labelOverride, }: {
    withVars: string[];
    value: any;
    varName: string;
    relationField: RelationField;
    parentVar: string;
    context: Context;
    refNode: Node;
    labelOverride?: string;
}): [string, any];
export default createConnectAndParams;
