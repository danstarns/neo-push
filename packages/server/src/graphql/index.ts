import { makeAugmentedSchema } from "@neo4j/graphql";
import { ApolloServer } from "apollo-server-express";
import { driver } from "../neo4j";
import * as User from "./User";
import * as Blog from "./Blog";
import * as Post from "./Post";
import * as Comment from "./Comment";

export const neoSchema = makeAugmentedSchema({
    typeDefs: [User.typeDefs, Blog.typeDefs, Post.typeDefs, Comment.typeDefs],
    resolvers: {
        ...User.resolvers,
    },
    context: { driver },
    debug: true,
});

export const server: ApolloServer = new ApolloServer({
    schema: neoSchema.schema,
    context: ({ req }) => ({ neoSchema, driver, req }),
});
