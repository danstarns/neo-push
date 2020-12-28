import { OGM } from "./src/graphql";
import * as neo4j from "./src/neo4j";
import createDebug from "./src/debug";
import faker from "faker";
import { hashPassword } from "./src/utils";

const debug = createDebug("Seeder");
const User = OGM.model("User");
const Blog = OGM.model("Blog");
const Post = OGM.model("Post");
const Comment = OGM.model("Comment");

const defaultEmail = "admin@admin.com";
const defaultPassword = "password";

async function main() {
    debug("Seeding Started");

    await neo4j.connect();

    await Promise.all([User, Blog, Post, Comment].map((m) => m.delete({})));

    const users = await User.create({
        input: await Promise.all(
            [
                [defaultEmail, defaultPassword],
                [faker.internet.email(), faker.internet.password()],
                [faker.internet.email(), faker.internet.password()],
            ].map(async ([email, password]) => {
                return {
                    email,
                    password: await hashPassword(password),
                };
            })
        ),
    });

    await Blog.create({
        input: users.map((user) => {
            return {
                name: faker.lorem.word(),
                creator: {
                    connect: { where: { id: user.id } },
                },
                posts: {
                    create: new Array(3).fill(null).map(() => ({
                        title: faker.lorem.word(),
                        content: faker.lorem.paragraphs(4),
                        author: {
                            connect: { where: { id: user.id } },
                        },
                        comments: {
                            create: new Array(3).fill(null).map(() => {
                                const u =
                                    users[
                                        Math.floor(Math.random() * users.length)
                                    ];

                                return {
                                    content: faker.lorem.paragraph(),
                                    author: {
                                        connect: { where: { id: u.id } },
                                    },
                                };
                            }),
                        },
                    })),
                },
            };
        }),
    });

    await neo4j.disconnect();

    debug("Seeding Finished");
}

main();
