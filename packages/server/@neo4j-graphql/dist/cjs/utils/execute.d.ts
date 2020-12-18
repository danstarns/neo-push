import { Driver } from "neo4j-driver";
import { NeoSchema } from "../classes";
declare function execute(input: {
    driver: Driver;
    cypher: string;
    params: any;
    defaultAccessMode: "READ" | "WRITE";
    neoSchema: NeoSchema;
    statistics?: boolean;
    raw?: boolean;
}): Promise<any>;
export default execute;
