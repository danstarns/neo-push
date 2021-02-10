import { Context, Node } from "../classes";
import { RelationField } from "../types";
declare function createConnectAndParams({ withVars, value, varName, relationField, parentVar, refNode, context, labelOverride, parentNode, fromCreate, insideDoWhen, }: {
    withVars: string[];
    value: any;
    varName: string;
    relationField: RelationField;
    parentVar: string;
    context: Context;
    refNode: Node;
    labelOverride?: string;
    parentNode: Node;
    fromCreate?: boolean;
    insideDoWhen?: boolean;
}): [string, any];
export default createConnectAndParams;
