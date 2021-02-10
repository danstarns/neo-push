import { Driver } from "neo4j-driver";
import { TypeDefs, Resolvers, SchemaDirectives } from "../types";
import NeoSchema from "./NeoSchema";
import Model from "./Model";
export interface OGMConstructor {
    typeDefs: TypeDefs;
    driver: Driver;
    resolvers?: Resolvers;
    schemaDirectives?: SchemaDirectives;
    debug?: boolean | ((...values: any[]) => void);
}
declare class OGM {
    neoSchema: NeoSchema;
    models: Model[];
    constructor(input: OGMConstructor);
    model(name: string): Model | undefined;
}
export default OGM;
