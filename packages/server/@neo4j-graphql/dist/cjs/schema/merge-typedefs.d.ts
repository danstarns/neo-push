import { DocumentNode } from "graphql";
declare function mergeTypeDefs(typeDefs: (string | DocumentNode) | (string | DocumentNode)[]): DocumentNode;
export default mergeTypeDefs;
