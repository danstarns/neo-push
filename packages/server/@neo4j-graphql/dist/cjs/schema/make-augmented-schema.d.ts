import { Driver } from "neo4j-driver";
import { NeoSchema } from "../classes";
export interface MakeAugmentedSchemaOptions {
    typeDefs: any;
    resolvers?: any;
    schemaDirectives?: any;
    debug?: boolean | ((...values: any[]) => void);
    context?: {
        [k: string]: any;
    } & {
        driver?: Driver;
    };
}
declare function makeAugmentedSchema(options: MakeAugmentedSchemaOptions): NeoSchema;
export default makeAugmentedSchema;
