import server from "../server";
import * as neo4j from "../neo4j";
import { Driver } from "neo4j-driver";
import { generate } from "randomstring";
import { IncomingMessage } from "http";
import { Socket } from "net";
import jsonwebtoken from "jsonwebtoken";
import gql from "graphql-tag";

describe("post-custom", () => {
    let driver: Driver;

    beforeAll(async () => {
        process.env.JWT_SECRET = "supersecret";
        driver = await neo4j.connect();
    });

    afterAll(async () => {
        delete process.env.JWT_SECRET;
        await driver.close();
    });

    describe("canEdit", () => {
        test("should return true on canEdit using custom cypher when user is creator of blog", async () => {
            const session = driver.session();

            const userId = generate({
                charset: "alphabetic",
            });

            const postId = generate({
                charset: "alphabetic",
            });

            const blogId = generate({
                charset: "alphabetic",
            });

            const mutation = gql`
                {
                    Posts(where: {id: "${postId}"}){
                        canEdit
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
                    CREATE (u:User {id: "${userId}"})
                    -[:HAS_BLOG]->(:Blog {id: "${blogId}"})
                    -[:HAS_POST]->(:Post {id: "${postId}"})
                `);

                const apolloServer = await server({ req });

                const response = await apolloServer.mutate({
                    mutation,
                });

                expect(response.errors).toEqual(undefined);

                expect((response.data as any).Posts[0].canEdit).toEqual(true);
            } finally {
                await session.close();
            }
        });

        test("should return true on canEdit using custom cypher when user is author of blog", async () => {
            const session = driver.session();

            const userId = generate({
                charset: "alphabetic",
            });

            const postId = generate({
                charset: "alphabetic",
            });

            const blogId = generate({
                charset: "alphabetic",
            });

            const mutation = gql`
                {
                    Posts(where: {id: "${postId}"}){
                        canEdit
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
                    CREATE (u:User {id: "${userId}"})
                    -[:CAN_POST]->(:Blog {id: "${blogId}"})
                    -[:HAS_POST]->(:Post {id: "${postId}"})
                `);

                const apolloServer = await server({ req });

                const response = await apolloServer.mutate({
                    mutation,
                });

                expect(response.errors).toEqual(undefined);

                expect((response.data as any).Posts[0].canEdit).toEqual(true);
            } finally {
                await session.close();
            }
        });

        test("should return true on canEdit using custom cypher when user is author of post", async () => {
            const session = driver.session();

            const userId = generate({
                charset: "alphabetic",
            });

            const postId = generate({
                charset: "alphabetic",
            });

            const blogId = generate({
                charset: "alphabetic",
            });

            const mutation = gql`
                {
                    Posts(where: {id: "${postId}"}){
                        canEdit
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
                    CREATE (u:User {id: "${userId}"})-[:WROTE]->
                           (:Post {id: "${postId}"})<-[:HAS_POST]-(:Blog {id: "${blogId}"})
                `);

                const apolloServer = await server({ req });

                const response = await apolloServer.mutate({
                    mutation,
                });

                expect(response.errors).toEqual(undefined);

                expect((response.data as any).Posts[0].canEdit).toEqual(true);
            } finally {
                await session.close();
            }
        });

        test("should return false on canEdit using custom cypher", async () => {
            const session = driver.session();

            const userId = generate({
                charset: "alphabetic",
            });

            const otherUser = generate({
                charset: "alphabetic",
            });

            const postId = generate({
                charset: "alphabetic",
            });

            const blogId = generate({
                charset: "alphabetic",
            });

            const mutation = gql`
                {
                    Posts(where: {id: "${postId}"}){
                        canEdit
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
                    CREATE (u:User {id: "${otherUser}"})
                    -[:HAS_BLOG]->(:Blog {id: "${blogId}"})
                    -[:HAS_POST]->(:Post {id: "${postId}"})
                `);

                const apolloServer = await server({ req });

                const response = await apolloServer.mutate({
                    mutation,
                });

                expect(response.errors).toEqual(undefined);

                expect((response.data as any).Posts[0].canEdit).toEqual(false);
            } finally {
                await session.close();
            }
        });
    });

    describe("canDelete", () => {
        test("should return true on canDelete using custom cypher when user is creator of blog", async () => {
            const session = driver.session();

            const userId = generate({
                charset: "alphabetic",
            });

            const postId = generate({
                charset: "alphabetic",
            });

            const blogId = generate({
                charset: "alphabetic",
            });

            const mutation = gql`
                {
                    Posts(where: {id: "${postId}"}){
                        canDelete
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
                    CREATE (u:User {id: "${userId}"})
                    -[:HAS_BLOG]->(:Blog {id: "${blogId}"})
                    -[:HAS_POST]->(:Post {id: "${postId}"})
                `);

                const apolloServer = await server({ req });

                const response = await apolloServer.mutate({
                    mutation,
                });

                expect(response.errors).toEqual(undefined);

                expect((response.data as any).Posts[0].canDelete).toEqual(true);
            } finally {
                await session.close();
            }
        });

        test("should return true on canDelete using custom cypher when user is author of post", async () => {
            const session = driver.session();

            const userId = generate({
                charset: "alphabetic",
            });

            const postId = generate({
                charset: "alphabetic",
            });

            const blogId = generate({
                charset: "alphabetic",
            });

            const mutation = gql`
                {
                    Posts(where: {id: "${postId}"}){
                        canDelete
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
                    CREATE (u:User {id: "${userId}"})
                    -[:WROTE]->(:Post {id: "${postId}"})
                    <-[:HAS_POST]-(:Blog {id: "${blogId}"})
                `);

                const apolloServer = await server({ req });

                const response = await apolloServer.mutate({
                    mutation,
                });

                expect(response.errors).toEqual(undefined);

                expect((response.data as any).Posts[0].canDelete).toEqual(true);
            } finally {
                await session.close();
            }
        });

        test("should return false on canDelete using custom cypher", async () => {
            const session = driver.session();

            const userId = generate({
                charset: "alphabetic",
            });

            const otherUser = generate({
                charset: "alphabetic",
            });

            const postId = generate({
                charset: "alphabetic",
            });

            const blogId = generate({
                charset: "alphabetic",
            });

            const mutation = gql`
                {
                    Posts(where: {id: "${postId}"}){
                        canDelete
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
                    CREATE (u:User {id: "${otherUser}"})
                    -[:HAS_BLOG]->(:Blog {id: "${blogId}"})
                    -[:HAS_POST]->(:Post {id: "${postId}"})
                `);

                const apolloServer = await server({ req });

                const response = await apolloServer.mutate({
                    mutation,
                });

                expect(response.errors).toEqual(undefined);

                expect((response.data as any).Posts[0].canDelete).toEqual(
                    false
                );
            } finally {
                await session.close();
            }
        });
    });
});