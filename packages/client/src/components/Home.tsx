import React, { useContext } from 'react';
import { Card, Row, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { auth } from "../contexts";
import constants from "../constants";
import * as markdown from "./Markdown";

const content = `
# neo-push

Example blog site build with \`@neo4j/graphql\` & React.js;

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
    post: Post @relationship(type: "HAS_COMMENT", direction: "IN")
}
\`\`\`

> Schema above simplified for clarity.

## Getting Started
Clone the repo;
\`\`\`
$ git clone git@github.com:danstarns/neo-push.git
\`\`\`

Enter the repo and install deps(lerna will install client and server);
\`\`\`
$ cd neo-push && npm ci
\`\`\`

[Configure environment variables](#how-to-configure-environment-variables)

Run the client on;

\`\`\`
$ npm run client:dev
\`\`\`

Run the server on;
\`\`\`
$ npm run server:dev
\`\`\`

Navigate to http://localhost:4000 and sign up! 

### FAQ

#### How to configure environment variables.
Each package contains a \`./env.example\` file. Copy this file, to the same directory, at \`./.env\` and adjust configuration to suit your local machine IE point to your neo4j database.
`;


function Home() {
    const { isLoggedIn } = useContext(auth.Context);
    const history = useHistory();

    if (isLoggedIn) {
        history.push(constants.DASHBOARD_PAGE);
    }

    return (
        <Container>
            <div>
                <Row className="p-2">
                    <Card className="m-0 p-3">
                        <markdown.Render markdown={content} />
                    </Card>
                </Row>
            </div>
        </Container>
    );
};


export default Home;