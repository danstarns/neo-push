import { Context } from "../types";
import { v4 as uuid } from "uuid";
import { comparePassword, createJWT, hashPassword } from "../utils";

async function signUp(_root, args: { email: string; password: string; }, context: Context) {
    const User = context.neoSchema.model("User");

    const [existing] = await User.find({ where: { email: args.email } });

    if (existing) {
        throw new Error("user with that email already exists");
    }

    const hash = await hashPassword(args.password);

    const [user] = await User.create({
        input: [{
            id: uuid(),
            email: args.email,
            password: hash
        }]
    });

    const jwt = createJWT({ sub: user.id });

    return jwt;
};

async function signIn(_root, args: { email: string; password: string; }, context: Context) {
    const User = context.neoSchema.model("User");

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
};

export const typeDefs = `
    type User {
        id: ID!
        email: String!
        password: String!
    }

    type Mutation {
        signUp(email: String!, password: String!): String # JWT
        signIn(email: String!, password: String!): String # JWT
    }
`;

export const resolvers = {
    Mutation: {
        signUp,
        signIn,
    }
};