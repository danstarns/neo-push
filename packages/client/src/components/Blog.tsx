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
    InputGroup,
    FormControl,
} from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import constants from "../constants";
import { Link } from "react-router-dom";
import { graphql, auth } from "../contexts";
import {
    BLOG,
    CREATE_POST,
    BLOG_POSTS,
    EDIT_BLOG,
    DELETE_BLOG,
} from "../queries";
import * as markdown from "./Markdown";

interface BlogInterface {
    id?: string;
    name?: string;
    creator?: { id: string; email: string };
    isCreator?: boolean;
    isAuthor?: boolean;
    createdAt?: string;
}

function CreatePost({
    close,
    blog,
}: {
    close: () => void;
    blog: BlogInterface;
}) {
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
                    variables: { title, content, user: getId(), blog: blog.id },
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

function BlogPosts({ blog }: { blog: BlogInterface }) {
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
                    variables: { blog: blog.id, skip, limit },
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

    if (!posts.length) {
        return <></>;
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
                    <p className="m-0 p-0">- {props.post.author.email}</p>
                    <p className="m-0 p-0 font-italic">
                        - {props.post.createdAt}
                    </p>
                </Card.Footer>
            </Card>
        </Col>
    );
}

function DeleteBlog(props: { blog: BlogInterface; close: () => void }) {
    const history = useHistory();
    const { mutate } = useContext(graphql.Context);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const deleteBlog = useCallback(async () => {
        setLoading(true);

        try {
            await mutate({
                mutation: DELETE_BLOG,
                variables: { id: props.blog.id },
            });

            history.push(constants.DASHBOARD_PAGE);
        } catch (e) {
            setError(e.message);
        }

        setLoading(false);
    }, []);

    if (loading) {
        return (
            <>
                <Modal.Header>
                    <Modal.Title>Delete Blog {props.blog.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column align-items-center">
                        <Spinner className="mt-5 mb-5" animation="border" />
                    </div>
                </Modal.Body>
            </>
        );
    }

    if (error) {
        <>
            <Modal.Header>
                <Modal.Title>Delete Blog {props.blog.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column align-items-center">
                    <Alert variant="danger text-center" className="mt-3">
                        {error}
                    </Alert>
                </div>
            </Modal.Body>
        </>;
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Delete Blog {props.blog.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="danger">
                    Are you sure you want to delete Blog {props.blog.name} ?
                </Alert>
                <div className="d-flex justify-content-end">
                    <Button variant="secondary" onClick={props.close}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        type="submit"
                        className="ml-2"
                        onClick={deleteBlog}
                    >
                        Delete
                    </Button>
                </div>
            </Modal.Body>
        </>
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
        createdAt?: string;
    }>({});
    const { query, mutate } = useContext(graphql.Context);
    const [loading, setLoading] = useState(true);
    const [creatingPost, setCreatingPost] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setEditedName(blog.name);
    }, [isEditing, blog]);

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
            } catch (e) {
                setError(e.message);
            }

            setLoading(false);
        })();
    }, [id]);

    const editBlog = useCallback(async () => {
        setLoading(true);

        try {
            await mutate({
                mutation: EDIT_BLOG,
                variables: { id: blog.id, name: editedName },
            });

            setBlog((b) => ({ ...b, name: editedName }));
            setIsEditing(false);
        } catch (e) {
            setError(e.message);
        }

        setLoading(false);
    }, [blog, editedName]);

    if (error) {
        return (
            <div className="d-flex flex-column align-items-center">
                <Alert variant="danger text-center" className="mt-3">
                    {error}
                </Alert>
            </div>
        );
    }

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
                    blog={blog}
                ></CreatePost>
            </Modal>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                size="lg"
                show={isDeleting}
                onHide={() => setIsDeleting((x) => !x)}
            >
                <DeleteBlog
                    close={() => setIsDeleting(false)}
                    blog={blog}
                ></DeleteBlog>
            </Modal>
            <Container>
                <Card className="mt-3 p-3">
                    {isEditing ? (
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="name">
                                    Name
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                size="lg"
                                onChange={(e) => setEditedName(e.target.value)}
                                value={editedName}
                                aria-label="Blog Name"
                                aria-describedby="name"
                            />
                        </InputGroup>
                    ) : (
                        <h1>{blog.name}</h1>
                    )}

                    <p className="text-muted">- {blog.creator?.email}</p>
                    <p className="text-muted">- {blog.createdAt}</p>
                    {(blog.isCreator || blog.isAuthor) && (
                        <>
                            <hr />
                            <div className="d-flex justify-content-start">
                                {!isEditing && (
                                    <Button
                                        variant="outline-primary"
                                        onClick={() =>
                                            setCreatingPost((x) => !x)
                                        }
                                    >
                                        Create Post
                                    </Button>
                                )}
                                {blog.isCreator && (
                                    <>
                                        {isEditing && (
                                            <>
                                                <Button
                                                    variant="warning"
                                                    onClick={() =>
                                                        setIsEditing(false)
                                                    }
                                                >
                                                    Cancel Edit
                                                </Button>
                                                <Button
                                                    className="ml-2"
                                                    variant="primary"
                                                    onClick={editBlog}
                                                >
                                                    Submit
                                                </Button>
                                            </>
                                        )}
                                        {!isEditing && (
                                            <>
                                                <Button
                                                    className="ml-3"
                                                    variant="outline-secondary"
                                                    onClick={() =>
                                                        setIsEditing((x) => !x)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    className="ml-3"
                                                    variant="outline-info"
                                                >
                                                    Admin
                                                </Button>
                                                <Button
                                                    className="ml-3"
                                                    variant="outline-danger"
                                                    onClick={() =>
                                                        setIsDeleting(true)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </Card>
                <BlogPosts blog={blog}></BlogPosts>
            </Container>
        </>
    );
}

export default Blog;
