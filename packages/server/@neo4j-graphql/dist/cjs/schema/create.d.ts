import { GraphQLResolveInfo } from "graphql";
import { NeoSchema, Node } from "../classes";
declare function create({ node, getSchema }: {
    node: Node;
    getSchema: () => NeoSchema;
}): {
    type: string;
    resolve: (_root: any, _args: any, context: any, resolveInfo: GraphQLResolveInfo) => Promise<{
        [x: number]: unknown[];
    }>;
    args: {
        input: string;
    };
};
export default create;
