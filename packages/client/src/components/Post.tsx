import React, { useState, useContext, useEffect, useCallback } from "react";
import {
    Alert,
    Spinner,
    Container,
    Card,
    Row,
    Col,
    Button,
} from "react-bootstrap";
import * as markdown from "./Markdown";
import { POST } from "../queries";
import { graphql, auth } from "../contexts";
import { useParams, useHistory } from "react-router-dom";
import constants from "../constants";

const comments = [
    {
        id: "1",
        content: `SUper COol `,
        user: {
            email: "danielstarns@hotmail.com",
        },
        createdAt: new Date().toISOString(),
    },
];

function CommentItem(props: { comment: any }) {
    return (
        <Card className="mt-3 p-3">
            <p className="text-muted">
                - {props.comment.user.email} at {props.comment.createdAt}
            </p>
            <div className="p-3">
                <markdown.Render markdown={props.comment.content} />
            </div>
        </Card>
    );
}

function Post() {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [post, setPost] = useState<{
        id?: string;
        title?: string;
        content?: string;
        author?: { id: string; email: string };
        isCreator?: boolean;
        isAuthor?: boolean;
    }>({});
    const { query } = useContext(graphql.Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const response = await query({
                    query: POST,
                    variables: { id },
                });

                const foundPost = response.Posts[0];
                if (!foundPost) {
                    history.push(constants.DASHBOARD_PAGE);
                }

                setPost(foundPost);
            } catch (e) {}

            setLoading(false);
        })();
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center">
                <Spinner className="m-5" animation="border" />
            </div>
        );
    }

    return (
        <Container>
            <Card className="mt-3 p-3">
                <h1>{post.title}</h1>
                <p className="text-muted">- {post.author.email}</p>
                {post.isAuthor && (
                    <>
                        <hr />
                        <div className="d-flex justify-content-start">
                            <Button variant="outline-danger">
                                Delete Post
                            </Button>
                        </div>
                    </>
                )}
            </Card>

            <Card className="mt-3 p-3">
                <markdown.Render markdown={post.content} />
            </Card>

            <Card className="mt-3 p-3 mb-3">
                <h2>Comments</h2>
                {comments.map((comment) => (
                    <CommentItem comment={comment}></CommentItem>
                ))}
                <div className="mt-3 d-flex justify-content-center w-100">
                    <Button>Load More</Button>
                </div>
            </Card>
        </Container>
    );
}

export default Post;
