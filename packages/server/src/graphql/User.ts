import { Context } from "../types";
import { v4 as uuid } from "uuid";
import { createJWT } from "../utils";

async function signUp(_root, args: { email: string; }, context: Context) {
    const User = context.neoSchema.model("User");

    const [existing] = await User.find({ where: { email: args.email } });

    if (existing) {
        throw new Error("user with that email already exists");
    }

    const [user] = await User.create({ input: [{ id: uuid(), email: args.email }] });

    const jwt = createJWT({ sub: user.id });

    return jwt;
};

async function signIn(_root, args: { email: string; }, context: Context) {
    const User = context.neoSchema.model("User");

    const user = await User.find({ where: { email: args.email } });

    if (!user) {
        throw new Error("user not found");
    }

    const jwt = createJWT({ sub: user.id });

    return jwt;
};

export const typeDefs = `
    type User {
        id: ID
        email: String
    }

    type Mutation {
        signUp(email: String): String # JWT
        signIn(email: String): String # JWT
    }
`;

export const resolvers = {
    Mutation: {
        signUp,
        signIn,
    }
};