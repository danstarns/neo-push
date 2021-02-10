import { Driver } from "neo4j-driver";
import { NeoSchema } from "../classes";
import { TypeDefs, Resolvers, SchemaDirectives } from "../types";
export interface MakeAugmentedSchemaOptions {
    typeDefs: TypeDefs;
    resolvers?: Resolvers;
    schemaDirectives?: SchemaDirectives;
    debug?: boolean | ((...values: any[]) => void);
    context?: {
        [k: string]: any;
    } & {
        driver?: Driver;
    };
}
declare function makeAugmentedSchema(options: MakeAugmentedSchemaOptions): NeoSchema;
export default makeAugmentedSchema;
