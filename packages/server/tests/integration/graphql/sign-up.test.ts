import server from "../server";
import * as neo4j from "../neo4j";
import { Driver } from "neo4j-driver";
import { generate } from "randomstring";
import { decodeJWT } from "../../../src/utils";

describe("signUp", () => {
    let driver: Driver;

    beforeAll(async () => {
        process.env.JWT_SECRET = "supersecret";
        driver = await neo4j.connect();
    });

    afterAll(async () => {
        delete process.env.JWT_SECRET;
        await driver.close();
    });

    test("should throw user with that email already exists", async () => {
        const apolloServer = await server();
        const session = driver.session();

        const mutation = `
            mutation signUp($email: String! $password: String!){
                signUp(email: $email, password: $password)
            }
        `;

        const id = generate({
            charset: "alphabetic",
        });

        const email = generate({
            charset: "alphabetic",
        });

        const password = generate({
            charset: "alphabetic",
        });

        try {
            await session.run(`
                CREATE (:User {id: $id, email: $email, password: $password})
            `, { id, email, password });

            const response = await apolloServer.mutate({
                mutation,
                variables: {
                    email,
                    password
                },
            });

            if (response.errors) {
                throw new Error(response.errors[0].message);
            }

            throw new Error("invalid");
        } catch (error) {
            expect(error.message).toEqual("user with that email already exists");
        } finally {
            await session.close();
        }
    });

    test("should create user and return JWT", async () => {
        const apolloServer = await server();
        const session = driver.session();

        const mutation = `
            mutation signUp($email: String! $password: String!){
                signUp(email: $email, password: $password)
            }
        `;

        const email = generate({
            charset: "alphabetic",
        });

        const password = generate({
            charset: "alphabetic",
        });

        const response = await apolloServer.mutate({
            mutation,
            variables: {
                email,
                password
            },
        });

        if (response.errors) {
            throw new Error(response.errors[0].message);
        }

        try {
            const JWT = response.data.signUp;

            const decoded = await decodeJWT(JWT);

            const user = await session.run(`
                MATCH (u:User {email: $email})
                RETURN u
            `, { email });

            expect(decoded.sub).toEqual(((user.records[0].toObject() as any).u.properties as any).id);
        } finally {
            await session.close();
        };

    });
});