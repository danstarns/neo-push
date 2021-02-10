import { BaseField } from "../types";
import { NeoSchema } from "../classes";
/**
 * Called on custom (Queries & Mutations "TOP LEVEL") with a @cypher directive. Not to mistaken for @cypher type fields.
 */
declare function cypherResolver({ field, statement, getSchema, }: {
    field: BaseField;
    statement: string;
    getSchema: () => NeoSchema;
}): {
    type: string;
    resolve: (_root: any, args: any, graphQLContext: any) => Promise<any>;
    args: {};
};
export default cypherResolver;
