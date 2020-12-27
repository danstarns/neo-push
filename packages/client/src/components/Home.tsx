import React from "react";
import { Card, Row, Container } from "react-bootstrap";
import * as markdown from "./Markdown";

const content = `
# neo-push

Example blog site built with \`@neo4j/graphql\` & React.js. This application showcases features of \`@neo4j/graphql\` such as;

1. Nested Mutations
2. @auth directive
3. OGM(Object Graph Mapper)

There are only two custom resolvers in the server; sign up plus sign in. The lack of custom logic is showcasing how quickly developers can build, both powerful and secure, applications ontop of Neo4j.

> Its worth nothing this entire application contains zero 'raw' cypher. All interaction's with the database are done through the generated GraphQL Schema via either the OGM or Apollo Server.

\`\`\`graphql
type User {
    id: ID!
    email: String!
    createdBlogs: [Blog] @relationship(type: "HAS_BLOG", direction: "OUT")
    authorsBlogs: [Blog] @relationship(type: "CAN_POST", direction: "OUT")
}

type Blog {
    id: ID!
    name: String!
    creator: User @relationship(type: "HAS_BLOG", direction: "IN")
    authors: [User] @relationship(type: "CAN_POST", direction: "IN")
    posts: [Post] @relationship(type: "HAS_POST", direction: "OUT")
}

type Post {
    id: ID!
    title: String!
    blog: Blog @relationship(type: "HAS_POST", direction: "IN")
    comments: [Comment] @relationship(type: "HAS_COMMENT", direction: "IN")
    author: User @relationship(type: "WROTE", direction: "IN")
}

type Comment {
    id: ID!
    author: User @relationship(type: "COMMENTED", direction: "OUT")
    content: String!
    post: Post @relationship(type: "HAS_COMMENT", direction: "IN")
}
\`\`\`

> Schema above simplified for clarity.

## Getting Started

If you want to run this Blog locally follow the steps below. When it comes to [Configure environment variables](#how-to-configure-environment-variables-?) you will need a [running Neo4j instance](#how-to-start-neo4j-?) to point to.

### How to configure environment variables ?

Each package contains a \`./env.example\` file. Copy this file, to the same directory, at \`./.env\` and adjust configuration to suit your local machine although the defaults may be fine.

### How to start Neo4j ?

There are many ways to get started with neo4j such as; [Neo4j Sandbox](https://neo4j.com/sandbox/), [Neo4j Desktop](https://neo4j.com/developer/neo4j-desktop/) or [Docker](https://neo4j.com/developer/docker/).

### Steps

Clone the repo;

\`\`\`
$ git clone git@github.com:danstarns/neo-push.git
\`\`\`

Enter the repo and install deps(lerna will install client and server);

\`\`\`
$ cd neo-push && npm ci
\`\`\`

=> [Configure environment variables](#how-to-configure-environment-variables) <=

Run the client on;

\`\`\`
$ npm run client:dev
\`\`\`

Run the server on;

\`\`\`
$ npm run server:dev
\`\`\`

Navigate to http://localhost:4000 and sign up!
`;

function Home() {
    return (
        <Container>
            <div className="p-3">
                <Row>
                    <Card className="m-0 p-3">
                        <markdown.Render markdown={content} />
                    </Card>
                </Row>
            </div>
        </Container>
    );
}

export default Home;
