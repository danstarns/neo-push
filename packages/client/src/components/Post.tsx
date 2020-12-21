import React, { useState, useContext, useEffect, useCallback } from "react";
import {
    Alert,
    Spinner,
    Container,
    Card,
    Row,
    Button,
    Form,
} from "react-bootstrap";
import * as markdown from "./Markdown";
import { POST } from "../queries";
import { graphql, auth } from "../contexts";
import { useParams, useHistory } from "react-router-dom";
import constants from "../constants";
import { POST_COMMENTS, COMMENT_ON_POST } from "../queries";

interface Comment {
    id: string;
    author: {
        id: string;
        email: string;
    };
    content: string;
    post: any;
}

function CreateComment({
    post,
    onCreate,
}: {
    post: string;
    onCreate: (comment: Comment) => void;
}) {
    const history = useHistory();
    const { mutate } = useContext(graphql.Context);
    const { getId } = useContext(auth.Context);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (content) {
            setError("");
        }
    }, [content, setError]);

    const submit = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            setLoading(true);

            try {
                const response = await mutate({
                    mutation: COMMENT_ON_POST,
                    variables: { post, content, user: getId() },
                });

                onCreate({
                    id: response.commentOnPost[0].id as string,
                    content,
                    author: {
                        id: response.commentOnPost[0].author.id as string,
                        email: response.commentOnPost[0].author.email as string,
                    },
                    post: {
                        id: post,
                    },
                });
                setContent("");
            } catch (e) {
                setError(e.message);
            }

            setLoading(false);
        },
        [content, post, mutate, setLoading, setError, getId]
    );

    if (loading) {
        return (
            <Card className="mt-3 p-3">
                <div className="d-flex flex-column align-items-center">
                    <Spinner className="mt-5 mb-5" animation="border" />
                </div>
            </Card>
        );
    }

    return (
        <Form onSubmit={submit}>
            <div className="mb-3">
                <markdown.Editor
                    markdown={content}
                    onChange={(mk: string) => setContent(mk)}
                ></markdown.Editor>
            </div>

            {error && (
                <Alert variant="danger text-center" className="mt-3">
                    {error}
                </Alert>
            )}
            <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit" className="ml-2">
                    Submit
                </Button>
            </div>
        </Form>
    );
}

function CommentItem(props: { comment: Comment }) {
    return (
        <Card className="mt-3 p-3">
            <p className="text-muted">- {props.comment.author.email}</p>
            <div className="p-3">
                <markdown.Render markdown={props.comment.content} />
            </div>
        </Card>
    );
}

function PostComments({
    post,
    setComments,
    comments,
}: {
    comments: Comment[];
    post: string;
    setComments: (cb: (comments: Comment[]) => any) => void;
}) {
    const { query } = useContext(graphql.Context);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const response = await query({
                    query: POST_COMMENTS,
                    variables: { post, skip, limit },
                });

                setComments((c: Comment[]) => [
                    ...c,
                    ...(response.postComments as Comment[]),
                ]);
            } catch (e) {}

            setLoading(false);
        })();
    }, [post, skip, limit, setComments]);

    if (loading) {
        <Card className="mt-3 p-3">
            <h2>Comments</h2>
            <div className="d-flex flex-column align-items-center">
                <Spinner className="mt-5" animation="border" />
            </div>
        </Card>;
    }

    if (!comments.length) {
        return <></>;
    }

    return (
        <>
            <h2>Comments</h2>
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment}></CommentItem>
            ))}
            <div className="d-flex justify-content-center w-100 mt-3">
                <Button>Load More</Button>
            </div>
        </>
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
    const [comments, setComments] = useState([]);

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
                <PostComments
                    post={post.id}
                    setComments={setComments}
                    comments={comments}
                />

                <div className="pt-3">
                    <CreateComment
                        post={post.id}
                        onCreate={(comment) => {
                            setComments((c) => [...c, comment]);
                        }}
                    ></CreateComment>
                </div>
            </Card>
        </Container>
    );
}

export default Post;
