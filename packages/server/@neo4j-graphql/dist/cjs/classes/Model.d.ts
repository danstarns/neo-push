import { DocumentNode, GraphQLSchema } from "graphql";
import { GraphQLOptionsArg, GraphQLWhereArg, DeleteInfo } from "../types";
export interface ModelConstructor {
    name: string;
    selectionSet: string;
    getGraphQLSchema: () => GraphQLSchema;
}
declare class Model<T = any> {
    name: string;
    private namePluralized;
    private getGraphQLSchema;
    protected selectionSet: string;
    constructor(input: ModelConstructor);
    setSelectionSet(selectionSet: string | DocumentNode): void;
    find({ where, options, selectionSet, args, context, rootValue, }?: {
        where?: GraphQLWhereArg;
        options?: GraphQLOptionsArg;
        selectionSet?: string | DocumentNode;
        args?: any;
        context?: any;
        rootValue?: any;
    }): Promise<T>;
    create({ input, selectionSet, args, context, rootValue, }?: {
        input?: any;
        selectionSet?: string | DocumentNode;
        args?: any;
        context?: any;
        rootValue?: any;
    }): Promise<T>;
    update({ where, update, connect, disconnect, create, selectionSet, args, context, rootValue, }?: {
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
