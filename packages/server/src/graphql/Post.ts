import gql from "graphql-tag";

export const typeDefs = gql`
    type Post @timestamps {
        id: ID! @autogenerated
        title: String!
        content: String!
        blog: Blog @relationship(type: "HAS_POST", direction: "IN")
        comments: [Comment] @relationship(type: "HAS_COMMENT", direction: "OUT")
        author: User @relationship(type: "WROTE", direction: "IN")
        isCreator: Boolean # TODO
        isAuthor: Boolean # TODO
    }

    extend type Post
        @auth(
            rules: [
                { operations: ["create"], bind: { author: { id: "sub" } } }
                { operations: ["read"], allow: "*" }
                {
                    operations: ["update"]
                    allow: {
                        OR: [
                            { author: { id: "sub" } }
                            {
                                blog: {
                                    OR: [
                                        { creator: { id: "sub" } }
                                        { authors: { id: "sub" } }
                                    ]
                                }
                            }
                        ]
                    }
                }
                {
                    operations: ["delete"]
                    allow: {
                        OR: [
                            { author: { id: "sub" } }
                            { blog: { creator: { id: "sub" } } }
                        ]
                    }
                }
            ]
        )
`;
