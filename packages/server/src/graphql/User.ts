import { Context } from "../types";
import { comparePassword, createJWT, hashPassword } from "../utils";
import gql from "graphql-tag";

async function signUp(
    _root,
    args: { email: string; password: string },
    context: Context
) {
    const User = context.OGM.model("User");

    const [existing] = await User.find({ where: { email: args.email } });

    if (existing) {
        throw new Error("user with that email already exists");
    }

    const hash = await hashPassword(args.password);

    const [user] = await User.create({
        input: [
            {
                email: args.email,
                password: hash,
            },
        ],
    });

    const jwt = createJWT({ sub: user.id });

    return jwt;
}

async function signIn(
    _root,
    args: { email: string; password: string },
    context: Context
) {
    const User = context.OGM.model("User");

    const [user] = await User.find({ where: { email: args.email } });

    if (!user) {
        throw new Error("user not found");
    }

    const equal = await comparePassword(args.password, user.password);
    if (!equal) {
        throw new Error("Unauthorized");
    }

    const jwt = await createJWT({ sub: user.id });

    return jwt;
}

export const typeDefs = gql`
    type User @timestamps {
        id: ID! @autogenerated
        email: String!
        password: String! ## protect to admins
        createdBlogs: [Blog] @relationship(type: "HAS_BLOG", direction: "OUT")
        authorsBlogs: [Blog] @relationship(type: "CAN_POST", direction: "OUT")
    }

    extend type User
        @auth(
            rules: [
                { operations: ["read", "create"], isAuthenticated: false }
                { operations: ["connect"], isAuthenticated: true }
                {
                    operations: ["update"]
                    allow: { id: "sub" }
                    bind: { id: "sub" }
                }
                { operations: ["delete"], allow: { id: "sub" } }
                {
                    operations: ["disconnect"]
                    allow: {
                        OR: [
                            { id: "sub" }
                            {
                                createdBlogs: {
                                    OR: [
                                        { creator: { id: "sub" } }
                                        { authors: { id: "sub" } }
                                    ]
                                }
                            }
                            {
                                authorsBlogs: {
                                    OR: [
                                        { creator: { id: "sub" } }
                                        { authors: { id: "sub" } }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        )

    type Mutation {
        signUp(email: String!, password: String!): String # JWT
        signIn(email: String!, password: String!): String # JWT
    }
`;

export const resolvers = {
    Mutation: {
        signUp,
        signIn,
    },
};
