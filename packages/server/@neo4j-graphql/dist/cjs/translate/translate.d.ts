import { GraphQLResolveInfo } from "graphql";
import { Driver } from "neo4j-driver";
declare function translate({ context: graphQLContext, resolveInfo, }: {
    context: {
        [k: string]: any;
    } & {
        driver?: Driver;
    };
    resolveInfo: GraphQLResolveInfo;
}): [string, any];
export default translate;
