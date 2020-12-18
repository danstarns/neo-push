import { GraphQLSchema } from "graphql";
import Node from "./Node";
import { MakeAugmentedSchemaOptions } from "../schema/index";
import Model from "./Model";
export interface NeoSchemaConstructor {
    schema: GraphQLSchema;
    nodes: Node[];
    options: MakeAugmentedSchemaOptions;
    resolvers: any;
    typeDefs: string;
}
declare class NeoSchema {
    schema: GraphQLSchema;
    nodes: Node[];
    options: MakeAugmentedSchemaOptions;
    resolvers: any;
    typeDefs: string;
    constructor(input: NeoSchemaConstructor);
    model(name: string): Model;
}
export default NeoSchema;
