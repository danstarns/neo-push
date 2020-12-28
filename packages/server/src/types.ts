import { NeoSchema } from "@neo4j/graphql/dist/cjs/classes";
import { Driver } from "neo4j-driver";

export type Context = {
    OGM: NeoSchema;
    adminOverride?: boolean;
    driver: Driver;
};
