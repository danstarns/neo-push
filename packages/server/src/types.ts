import { OGM } from "@neo4j/graphql";
import { Driver } from "neo4j-driver";

export type Context = {
    ogm: OGM;
    adminOverride?: boolean;
    driver: Driver;
};
