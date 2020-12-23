import { Context, Node } from "../classes";
import { RelationField } from "../types";
declare function createDisconnectAndParams({ withVars, value, varName, relationField, parentVar, refNode, context, labelOverride, parentNode, }: {
    withVars: string[];
    value: any;
    varName: string;
    relationField: RelationField;
    parentVar: string;
    context: Context;
    refNode: Node;
    labelOverride?: string;
    parentNode: Node;
}): [string, any];
export default createDisconnectAndParams;
