import { ApolloServer } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import { OGM, neoSchema } from "../../src/graphql";
import * as neo4j from "./neo4j";

async function server(context = {}) {
    const driver = await neo4j.connect();

    const server = new ApolloServer({
        schema: neoSchema.schema,
        context: () => ({ ...context, driver, OGM }),
    });

    const client = createTestClient(server);

    return client;
}

export default server;
