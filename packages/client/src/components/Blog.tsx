import React, { useState, useContext, useEffect, useCallback } from "react";
import {
    Container,
    Card,
    Row,
    Col,
    Button,
    Spinner,
    Modal,
    Form,
    Alert,
} from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import constants from "../constants";
import { Link } from "react-router-dom";
import { graphql, auth } from "../contexts";
import { BLOG, CREATE_POST, BLOG_POSTS } from "../queries";
import * as markdown from "./Markdown";

function CreatePost({ close, blog }: { close: () => void; blog: string }) {
    const history = useHistory();
    const { mutate } = useContext(graphql.Context);
    const { getId } = useContext(auth.Context);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (title && content) {
            setError("");
        }
    }, [title, content, setError]);

    const submit = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            setLoading(true);

            try {
                const response = await mutate({
                    mutation: CREATE_POST,
                    variables: { title, content, user: getId(), blog },
                });

                history.push(
                    constants.POST_PAGE + "/" + response.createPosts[0].id
                );
            } catch (e) {
                setError(e.message);
            }

            setLoading(false);
        },
        [title, content, blog, mutate, setLoading, setError, getId]
    );

    if (loading) {
        return (
            <>
                <Modal.Header>
                    <Modal.Title>Creating Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column align-items-center">
                        <Spinner className="mt-5 mb-5" animation="border" />
                    </div>
                </Modal.Body>
            </>
        );
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Create Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={submit}>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={60}
                        />
                    </Form.Group>

                    <Form.Label>Content</Form.Label>
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
                        <Button variant="warning" onClick={close}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="ml-2"
                        >
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </>
    );
}

function BlogPosts({ blog }: { blog: string }) {
    const { query } = useContext(graphql.Context);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [hasMore, setHasMore] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const response = await query({
                    query: BLOG_POSTS,
                    variables: { blog, skip, limit },
                });

                setPosts(response.blogPosts);
            } catch (e) {}

            setLoading(false);
        })();
    }, [blog, skip, limit]);

    if (loading) {
        <Card className="mt-3 p-3">
            <h2>Posts</h2>
            <div className="d-flex flex-column align-items-center">
                <Spinner className="mt-5" animation="border" />
            </div>
        </Card>;
    }

    return (
        <Card className="mt-3 p-3">
            <h2>Posts</h2>
            <Row>
                {posts.map((post) => (
                    <PostItem key={post.id} post={post}></PostItem>
                ))}
            </Row>
            <div className="d-flex justify-content-center w-100">
                <Button>Load More</Button>
            </div>
        </Card>
    );
}

function PostItem(props: { post: any }) {
    return (
        <Col md={{ span: 4 }} className="p-0">
            <Card className="m-3">
                <Card.Title className="m-2">{props.post.title}</Card.Title>
                <Card.Subtitle className="m-2">
                    <Link to={constants.POST_PAGE + `/${props.post.id}`}>
                        Read
                    </Link>
                </Card.Subtitle>
                <Card.Footer className="text-muted">
                    - {props.post.author.email}
                </Card.Footer>
            </Card>
        </Col>
    );
}

function Blog() {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [blog, setBlog] = useState<{
        id?: string;
        name?: string;
        creator?: { id: string; email: string };
        isCreator?: boolean;
        isAuthor?: boolean;
    }>({});
    const { query } = useContext(graphql.Context);
    const [loading, setLoading] = useState(true);
    const [creatingPost, setCreatingPost] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await query({
                    query: BLOG,
                    variables: { id },
                });

                const foundBlog = response.Blogs[0];
                if (!foundBlog) {
                    history.push(constants.DASHBOARD_PAGE);
                }

                setBlog(foundBlog);
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
        <>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                size="lg"
                show={creatingPost}
                onHide={() => setCreatingPost((x) => !x)}
            >
                <CreatePost
                    close={() => setCreatingPost(false)}
                    blog={blog.id}
                ></CreatePost>
            </Modal>
            <Container>
                <Card className="mt-3 p-3">
                    <h1>{blog.name}</h1>
                    <p className="text-muted">- {blog.creator?.email}</p>
                    {(!blog.isCreator || blog.isAuthor) && (
                        <>
                            <hr />
                            <div className="d-flex justify-content-start">
                                <Button
                                    variant="outline-primary"
                                    onClick={() => setCreatingPost((x) => !x)}
                                >
                                    Create Post
                                </Button>
                                {!blog.isCreator && (
                                    <>
                                        <Button
                                            className="ml-3"
                                            variant="outline-info"
                                        >
                                            Admin
                                        </Button>
                                        <Button
                                            className="ml-3"
                                            variant="outline-danger"
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </Card>
                <BlogPosts blog={blog.id}></BlogPosts>
            </Container>
        </>
    );
}

export default Blog;
