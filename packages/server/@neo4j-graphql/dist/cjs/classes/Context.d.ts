import { Driver } from "neo4j-driver";
import NeoSchema from "./NeoSchema";
export interface ContextConstructor {
    graphQLContext: any;
    neoSchema: NeoSchema;
    driver: Driver;
}
declare class Context {
    readonly graphQLContext: any;
    readonly neoSchema: NeoSchema;
    readonly driver: Driver;
    jwt: any;
    constructor(input: ContextConstructor);
    getJWT(): any;
}
export default Context;
