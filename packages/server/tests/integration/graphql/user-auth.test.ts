import server from "../server";
import * as neo4j from "../neo4j";
import { Driver } from "neo4j-driver";
import { generate } from "randomstring";
import { IncomingMessage } from "http";
import { Socket } from "net";
import jsonwebtoken from "jsonwebtoken";
import gql from "graphql-tag";

describe("user-auth", () => {
    let driver: Driver;

    beforeAll(async () => {
        process.env.JWT_SECRET = "supersecret";
        driver = await neo4j.connect();
    });

    afterAll(async () => {
        delete process.env.JWT_SECRET;
        await driver.close();
    });

    test("should throw error if user is trying to edit another user(allow)", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const anotherUserId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
            mutation {
                updateUsers(where: {id: "${anotherUserId}"}, update: {id: "${userId}"}) {
                    id
                }
            }
        `;

        const token = jsonwebtoken.sign(
            { sub: userId },
            process.env.JWT_SECRET as string
        );

        const socket = new Socket({ readable: true });
        const req = new IncomingMessage(socket);
        req.headers.authorization = `Bearer ${token}`;

        try {
            await session.run(`
                CREATE (:User {id: "${userId}"})
                CREATE (:User {id: "${anotherUserId}"})
            `);

            const apolloServer = await server({ req });

            const response = await apolloServer.mutate({
                mutation,
            });

            if (response.errors) {
                throw new Error(response.errors[0].message);
            }

            throw new Error("invalid");
        } catch (error) {
            expect(error.message).toEqual("Forbidden");
        } finally {
            await session.close();
        }
    });

    test("should throw error if user is changing its id(bind)", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const anotherUserId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
            mutation {
                updateUsers(where: {id: "${userId}"}, update: {id: "${anotherUserId}"}) {
                    id
                }
            }
        `;

        const token = jsonwebtoken.sign(
            { sub: userId },
            process.env.JWT_SECRET as string
        );

        const socket = new Socket({ readable: true });
        const req = new IncomingMessage(socket);
        req.headers.authorization = `Bearer ${token}`;

        try {
            await session.run(`
                CREATE (:User {id: "${userId}"})
            `);

            const apolloServer = await server({ req });

            const response = await apolloServer.mutate({
                mutation,
            });

            if (response.errors) {
                throw new Error(response.errors[0].message);
            }

            throw new Error("invalid");
        } catch (error) {
            expect(error.message).toEqual("Forbidden");
        } finally {
            await session.close();
        }
    });

    test("should throw error when user is deleting another user(allow)", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const anotherUserId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
            mutation {
                deleteUsers(where: {id: "${anotherUserId}"}) {
                    nodesDeleted
                }
            }
        `;

        const token = jsonwebtoken.sign(
            { sub: userId },
            process.env.JWT_SECRET as string
        );

        const socket = new Socket({ readable: true });
        const req = new IncomingMessage(socket);
        req.headers.authorization = `Bearer ${token}`;

        try {
            await session.run(`
                CREATE (:User {id: "${userId}"})
                CREATE (:User {id: "${anotherUserId}"})
            `);

            const apolloServer = await server({ req });

            const response = await apolloServer.mutate({
                mutation,
            });

            if (response.errors) {
                throw new Error(response.errors[0].message);
            }

            throw new Error("invalid");
        } catch (error) {
            expect(error.message).toEqual("Forbidden");
        } finally {
            await session.close();
        }
    });
});
