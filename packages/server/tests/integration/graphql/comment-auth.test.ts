import server from "../server";
import * as neo4j from "../neo4j";
import { Driver } from "neo4j-driver";
import { generate } from "randomstring";
import { IncomingMessage } from "http";
import { Socket } from "net";
import jsonwebtoken from "jsonwebtoken";
import gql from "graphql-tag";

describe("comment-auth", () => {
    let driver: Driver;

    beforeAll(async () => {
        process.env.JWT_SECRET = "supersecret";
        driver = await neo4j.connect();
    });

    afterAll(async () => {
        delete process.env.JWT_SECRET;
        await driver.close();
    });

    test("should throw error when user creating a comment related to another user", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const commentId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
                mutation {
                    createComments(input: [{ id: "${commentId}", content: "test", author: { connect: { where: { id: "invalid" } } } }]) {
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

    test("should throw error when user is updating a comment not belonging to them(allow)", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const commentId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
                mutation {
                    updateComments(where: { id: "${commentId}"}, update: { author: { where: { id: "${userId}" }, update: {id: "invalid"} } } ) {
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
                    CREATE (:Comment {id: "${commentId}"})
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

    test("should throw error when user is updating a comment not belonging to them(bind)", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const commentId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
                mutation {
                    updateComments(where: { id: "${commentId}"}, update: { author: { where: { id: "${userId}" }, update: {id: "invalid"} } } ) {
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
                    CREATE (:Comment {id: "${commentId}"})<-[:HAS_COMMENT]-(:User {id: "${userId}"})
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
