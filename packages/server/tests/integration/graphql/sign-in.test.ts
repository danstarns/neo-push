import server from "../server";
import * as neo4j from "../neo4j";
import { Driver } from "neo4j-driver";
import { generate } from "randomstring";
import { decodeJWT, hashPassword } from "../../../src/utils";

describe("signIn", () => {
    let driver: Driver;

    beforeAll(async () => {
        process.env.JWT_SECRET = "supersecret";
        driver = await neo4j.connect();
    });

    afterAll(async () => {
        delete process.env.JWT_SECRET;
        await driver.close();
    });

    test("should throw user not found", async () => {
        const apolloServer = await server();

        const mutation = `
            mutation signIn($email: String! $password: String!){
                signIn(email: $email, password: $password)
            }
        `;

        const email = generate({
            charset: "alphabetic",
        });

        const password = generate({
            charset: "alphabetic",
        });

        try {
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
            expect(error.message).toEqual("user not found");
        }
    });

    test("should throw Unauthorized on invalid password", async () => {
        const apolloServer = await server();
        const session = driver.session();

        const mutation = `
            mutation signIn($email: String! $password: String!){
                signIn(email: $email, password: $password)
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
               `, { id, email, password: await hashPassword(password) });

            const response = await apolloServer.mutate({
                mutation,
                variables: {
                    email,
                    password: "invalid"
                },
            });

            if (response.errors) {
                throw new Error(response.errors[0].message);
            }

        } catch (error) {
            expect(error.message).toEqual("Unauthorized");
        } finally {
            await session.close();
        };

    });

    test("should sign user in and return JWT", async () => {
        const apolloServer = await server();
        const session = driver.session();

        const mutation = `
            mutation signIn($email: String! $password: String!){
                signIn(email: $email, password: $password)
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
            const user = await session.run(`
                CREATE (u:User {id: $id, email: $email, password: $password})
                RETURN u
            `, { id, email, password: await hashPassword(password) });

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

            const JWT = response.data.signIn;

            const decoded = await decodeJWT(JWT);

            expect(decoded.sub).toEqual(((user.records[0].toObject() as any).u.properties as any).id);
        } finally {
            await session.close();
        };

    });
});