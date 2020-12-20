import React, { useState } from 'react';
import { Alert, Spinner, Container, Card, Row, Col, Button } from "react-bootstrap";
import * as markdown from "./Markdown";

const content = `
# neo-push

Example blog site build with \`@neo4j/graphql\` & React.js;

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


const comments = [
    {
        id: "1",
        content: `SUper COol `,
        user: {
            email: "danielstarns@hotmail.com",
        },
        createdAt: new Date().toISOString()
    }
];

function CommentItem(props: { comment: any; }) {
    return (
        <Card className="mt-3 p-3">
            <p className="text-muted">- {props.comment.user.email} at {props.comment.createdAt}</p>
            <div className="p-3">
                <markdown.Render markdown={props.comment.content} />
            </div>
        </Card>
    );
}

function Post() {
    const [isAuthor] = useState(true);

    return (
        <Container>
            <Card className="mt-3 p-3">
                <h1>Some Cool Post</h1>
                <p className="text-muted">- Daniel Starns at {new Date().toISOString()}</p>
                {(isAuthor) &&
                    <>
                        <hr />
                        <div className="d-flex justify-content-start">
                            <Button variant="outline-danger">
                                Delete Post
                            </Button>
                        </div>
                    </>
                }
            </Card>

            <Card className="mt-3 p-3">
                <markdown.Render markdown={content} />
            </Card>

            <Card className="mt-3 p-3 mb-3">
                <h2>Comments</h2>
                {comments.map(comment => <CommentItem comment={comment}></CommentItem>)}
                <div className="mt-3 d-flex justify-content-center w-100">
                    <Button>Load More</Button>
                </div>
            </Card>
        </Container>
    );
};


export default Post;