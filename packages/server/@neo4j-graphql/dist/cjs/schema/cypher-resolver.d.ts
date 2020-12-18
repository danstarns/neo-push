import { BaseField } from "../types";
import { NeoSchema } from "../classes";
/**
 * Called on custom (Queries & Mutations "TOP LEVEL") with a @cypher directive. Not to mistaken for @cypher type fields.
 */
declare function cypherResolver({ defaultAccessMode, field, statement, getSchema, }: {
    defaultAccessMode: "READ" | "WRITE";
    field: BaseField;
    statement: string;
    getSchema: () => NeoSchema;
}): {
    type: string;
    resolve: (_root: any, args: any, context: any) => Promise<any>;
    args: {};
};
export default cypherResolver;
