import { GraphQLResolveInfo } from "graphql";
import { NeoSchema, Node } from "../classes";
declare function deleteResolver({ node, getSchema }: {
    node: Node;
    getSchema: () => NeoSchema;
}): {
    type: string;
    resolve: (_root: any, _args: any, context: any, resolveInfo: GraphQLResolveInfo) => Promise<any>;
    args: {
        where: string;
    };
};
export default deleteResolver;
