import { NeoSchema } from "../classes";
import { Resolvers } from "../types";
declare function wrapCustomResolvers({ resolvers, generatedResolvers, nodeNames, getNeoSchema, }: {
    resolvers: Resolvers;
    getNeoSchema: () => NeoSchema;
    nodeNames: string[];
    generatedResolvers: any;
}): Resolvers;
export default wrapCustomResolvers;
