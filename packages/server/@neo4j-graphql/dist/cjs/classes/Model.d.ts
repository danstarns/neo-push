import { DocumentNode } from "graphql";
import { GraphQLOptionsArg, GraphQLWhereArg, DeleteInfo } from "../types";
import NeoSchema from "./NeoSchema";
export interface ModelConstructor {
    name: string;
    selectionSet: string;
    neoSchema: NeoSchema;
}
declare class Model {
    name: string;
    private namePluralized;
    private camelCaseName;
    private neoSchema;
    protected selectionSet: string;
    constructor(input: ModelConstructor);
    setSelectionSet(selectionSet: string | DocumentNode): void;
    find<T = any[]>({ where, options, selectionSet, args, context, rootValue, }?: {
        where?: GraphQLWhereArg;
        options?: GraphQLOptionsArg;
        selectionSet?: string | DocumentNode;
        args?: any;
        context?: any;
        rootValue?: any;
    }): Promise<T>;
    create<T = any>({ input, selectionSet, args, context, rootValue, }?: {
        input?: any;
        selectionSet?: string | DocumentNode;
        args?: any;
        context?: any;
        rootValue?: any;
    }): Promise<T>;
    update<T = any>({ where, update, connect, disconnect, create, selectionSet, args, context, rootValue, }?: {
        where?: GraphQLWhereArg;
        update?: any;
        connect?: any;
        disconnect?: any;
        create?: any;
        selectionSet?: string | DocumentNode;
        args?: any;
        context?: any;
        rootValue?: any;
    }): Promise<T>;
    delete({ where, context, rootValue, }?: {
        where?: GraphQLWhereArg;
        context?: any;
        rootValue?: any;
    }): Promise<DeleteInfo>;
}
export default Model;
