import * as User from "./User";
import { makeAugmentedSchema } from "@neo4j/graphql";
import { ApolloServer } from "apollo-server-express";
import { driver } from "../neo4j";

export const neoSchema = makeAugmentedSchema({
    typeDefs: [User.typeDefs],
    resolvers: {
        ...User.resolvers
    },
    context: { driver }
});

export const server: ApolloServer = new ApolloServer({
    schema: neoSchema.schema,
    context: { neoSchema, driver }
});