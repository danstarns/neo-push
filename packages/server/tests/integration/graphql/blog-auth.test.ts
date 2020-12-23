import server from "../server";
import * as neo4j from "../neo4j";
import { Driver } from "neo4j-driver";
import { generate } from "randomstring";
import { IncomingMessage } from "http";
import { Socket } from "net";
import jsonwebtoken from "jsonwebtoken";
import gql from "graphql-tag";

describe("blog-auth", () => {
    let driver: Driver;

    beforeAll(async () => {
        process.env.JWT_SECRET = "supersecret";
        driver = await neo4j.connect();
    });

    afterAll(async () => {
        delete process.env.JWT_SECRET;
        await driver.close();
    });

    test("should throw if blog.creator is not bound to jwt sub (on create)", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const blogId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
            mutation {
                createBlogs(input: [{ id: "${blogId}", name: "test", creator: { connect: { where: { id: "invalid" } } } }]) {
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

    test("should throw if blog.creator is not bound to jwt sub (on update)", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const blogId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
            mutation {
                updateBlogs(where: { id: "${blogId}"}, update: { creator: { where: { id: "${userId}" }, update: {id: "invalid"} } } ) {
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
                CREATE (:Blog {id: "${blogId}"})<-[:HAS_BLOG]-(:User {id: "${userId}"})
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

    test("should throw when trying to edit a blog when user is not creator", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const blogId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
            mutation {
                updateBlogs(where: { id: "${blogId}"}, update: { id: "invalid" } ) {
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
                CREATE (:Blog {id: "${blogId}"})
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

    test("should throw if blog.creator is not bound to jwt sub (on connect)", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const blogId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
            mutation {
                updateBlogs(where: { id: "${blogId}"}, connect: { creator: { where: { id: "invalid" } } } ) {
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
                CREATE (:Blog {id: "${blogId}"})
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

    test("should throw if non creator is deleting a blog", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const blogId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
            mutation {
                deleteBlogs(where: { id: "${blogId}"} ) {
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
                CREATE (:Blog {id: "${blogId}"})
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

    test("should throw if non creator is disconnecting a blog", async () => {
        const session = driver.session();

        const userId = generate({
            charset: "alphabetic",
        });

        const blogId = generate({
            charset: "alphabetic",
        });

        const mutation = gql`
            mutation {
                updateBlogs(where: { id: "${blogId}"}, disconnect: { creator: { where: { id: "${userId}" } } } ) {
                    id
                }
            }
        `;

        const token = jsonwebtoken.sign(
            { sub: "invalid" },
            process.env.JWT_SECRET as string
        );

        const socket = new Socket({ readable: true });
        const req = new IncomingMessage(socket);
        req.headers.authorization = `Bearer ${token}`;

        try {
            await session.run(`
                CREATE (:Blog {id: "${blogId}"})<-[:HAS_BLOG]-(:User {id: "${userId}"})
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
