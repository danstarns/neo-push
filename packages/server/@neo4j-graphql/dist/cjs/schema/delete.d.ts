import { GraphQLResolveInfo } from "graphql";
import { NeoSchema, Node } from "../classes";
declare function deleteResolver({ node, getSchema }: {
    node: Node;
    getSchema: () => NeoSchema;
}): {
    type: string;
    resolve: (_root: any, _args: any, context: any, resolveInfo: GraphQLResolveInfo) => Promise<any>;
    args: {
        delete?: string;
        where: string;
    };
};
export default deleteResolver;
