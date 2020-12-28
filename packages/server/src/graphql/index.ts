import { makeAugmentedSchema } from "@neo4j/graphql";
import { ApolloServer } from "apollo-server-express";
import { driver } from "../neo4j";
import * as User from "./User";
import * as Blog from "./Blog";
import * as Post from "./Post";
import * as Comment from "./Comment";
import { DocumentNode } from "graphql";
import * as config from "../../config";

const typeDefs = [
    User.typeDefs,
    Blog.typeDefs,
    Post.typeDefs,
    Comment.typeDefs,
];

// without auth and extensions for seeder and custom logic
export const OGM = makeAugmentedSchema({
    typeDefs: typeDefs.reduce(
        (res: DocumentNode, type) => {
            const filtered = type.definitions.filter(
                (x) => !x.kind.includes("Extension")
            );

            return {
                ...res,
                definitions: [...res.definitions, ...filtered],
            };
        },
        {
            kind: "Document",
            definitions: [],
        }
    ),
    resolvers: {
        ...User.resolvers,
    },
    context: { driver },
    debug: config.NODE_ENV === "development",
});

// with auth and extensions for server
export const neoSchema = makeAugmentedSchema({
    typeDefs,
    resolvers: {
        ...User.resolvers,
    },
    context: { driver, OGM },
    debug: config.NODE_ENV === "development",
});

export const server: ApolloServer = new ApolloServer({
    schema: neoSchema.schema,
    context: ({ req }) => ({ OGM, driver, req }),
});
