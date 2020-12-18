import { GraphQLResolveInfo } from "graphql";
import { NeoSchema, Node } from "../classes";
declare function update({ node, getSchema }: {
    node: Node;
    getSchema: () => NeoSchema;
}): {
    type: string;
    resolve: (_root: any, _args: any, context: any, resolveInfo: GraphQLResolveInfo) => Promise<any>;
    args: {
        connect: string;
        disconnect: string;
        create: string;
        where: string;
        update: string;
    } | {
        where: string;
        update: string;
    };
};
export default update;
