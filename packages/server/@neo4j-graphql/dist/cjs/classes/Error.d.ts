export declare class Neo4jGraphQLError extends Error {
    readonly name: any;
    constructor(message: string);
}
export declare class Neo4jGraphQLForbiddenError extends Neo4jGraphQLError {
    readonly name: any;
    constructor(message: string);
}
export declare class Neo4jGraphQLAuthenticationError extends Neo4jGraphQLError {
    readonly name: any;
    constructor(message: string);
}
