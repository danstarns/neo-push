import React, { useState, useContext, useEffect } from "react";
import { Alert, Spinner, Container, Card, Row, Col, Button } from "react-bootstrap";
import { auth, graphql } from "../contexts";
import gql from "graphql-tag";
import constants from "../constants";
import { Link } from "react-router-dom";

const USERS = gql`
    query user($id: ID) {
        Users(where: {id: $id}){
            email
        }
    }
`;

const blogs = [
    { id: "2", name: "My Blog" },
    { id: "2", name: "My Blog" },
    { id: "2", name: "My Blog" },
    { id: "2", name: "My Blog" },
    { id: "2", name: "My Blog" }
];

function BlogItem(props: { blog: any; }) {
    return (
        <Col md={{ span: 4 }} className="p-0">
            <Card className="m-3">
                <Card.Title className="m-2">{props.blog.name}</Card.Title>
                <Card.Subtitle className="m-2">
                    <Link to={constants.BLOG_PAGE + `/${props.blog.id}`}>
                        Read
                    </Link>
                </Card.Subtitle>
                <Card.Footer className="text-muted">You 2 days ago</Card.Footer>
            </Card>
        </Col>
    );
}

function Dashboard() {
    const { getId } = useContext(auth.Context);
    const { query } = useContext(graphql.Context);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ email: string; }>();

    useEffect(() => {
        (async () => {
            try {
                const response = await query({
                    query: USERS,
                    variables: { id: getId() },
                });

                setUser(response.Users[0]);
            } catch (e) {
                setError(e.message);
            }

            setLoading(false);
        })();
    }, [getId]);

    if (error) {
        return <Alert>{error}</Alert>;
    }

    if (loading) {
        return <div className="d-flex flex-column align-items-center">
            <Spinner className="mt-5" animation="border" />
        </div>;
    }

    return (
        <Container>
            <Card className="mt-3 p-3">
                <h1>Hey, {user.email}</h1>
                <p className="text-muted">
                    Browse the blogs below or create one and write some posts!
                </p>
                <hr />
                <div className="d-flex justify-content-start">
                    <Button variant="outline-primary">
                        Create Blog
                    </Button>
                </div>
            </Card>

            <Card className="mt-3 p-3">
                <h2>My Blogs</h2>
                <Row>
                    {blogs.map((blog) => <BlogItem blog={blog}></BlogItem>)}
                </Row>
                <div className="d-flex justify-content-center w-100">
                    <Button>Load More</Button>
                </div>
            </Card>

            <Card className="mt-3 p-3 mb-3">
                <h2>Recently added Blogs</h2>
                <Row>
                    {blogs.map((blog) => <BlogItem blog={blog}></BlogItem>)}
                </Row>
                <div className="d-flex justify-content-center w-100">
                    <Button>Load More</Button>
                </div>
            </Card>

        </Container >

    );
}

export default Dashboard;
