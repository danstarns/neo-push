import React, { useState } from 'react';
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import constants from "../constants";
import { Link } from "react-router-dom";

const posts = [
    { id: "2", title: "My Post" },
    { id: "2", title: "My Post" },
    { id: "2", title: "My Post" },
    { id: "2", title: "My Post" },
    { id: "2", title: "My Post" }
];

function PostItem(props: { post: any; }) {
    return (
        <Col md={{ span: 4 }} className="p-0">
            <Card className="m-3">
                <Card.Title className="m-2">{props.post.title}</Card.Title>
                <Card.Subtitle className="m-2">
                    <Link to={constants.POST_PAGE + `/${props.post.id}`}>
                        Read
                    </Link>
                </Card.Subtitle>
                <Card.Footer className="text-muted">You 2 days ago</Card.Footer>
            </Card>
        </Col>
    );
}

function Blog() {
    const { id } = useParams<{ id: string; }>();
    const [blog] = useState({
        name: "some cool blog title",
        creator: { email: "danielstarns@hotmail.com" },
        isCreator: true,
        isAuthor: true
    });

    return (
        <Container>
            <Card className="mt-3 p-3">
                <h1>{blog.name}</h1>
                <p className="text-muted">- {blog.creator.email}</p>
                {(blog.isCreator || blog.isAuthor) &&
                    <>
                        <hr />
                        <div className="d-flex justify-content-start">
                            <Button variant="outline-primary">
                                Create Post
                            </Button>
                            {blog.isCreator &&
                                <>
                                    <Button className="ml-3" variant="outline-info">
                                        Admin
                                    </Button>
                                    <Button className="ml-3" variant="outline-danger">
                                        Delete
                                    </Button>
                                </>
                            }

                        </div>
                    </>
                }
            </Card>

            <Card className="mt-3 p-3 mb-3">
                <h2>Posts</h2>
                <Row>
                    {posts.map((post) => <PostItem post={post}></PostItem>)}
                </Row>
                <div className="d-flex justify-content-center w-100">
                    <Button>Load More</Button>
                </div>
            </Card>
        </Container>
    );
};


export default Blog;