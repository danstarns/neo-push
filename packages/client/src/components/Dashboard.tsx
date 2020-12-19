import React, { useState, useContext, useEffect } from "react";
import { Alert, Spinner, Container, } from "react-bootstrap";
import { auth, graphql } from "../contexts";
import gql from "graphql-tag";

const USERS = gql`
    query user($id: ID) {
        Users(where: {id: $id}){
            email
        }
    }
`;

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
            <Alert variant="success" className="mt-3">
                <Alert.Heading>Hey, {user.email}</Alert.Heading>
                <p>
                    Browse the blogs below or Create a blog and write some posts!
                </p>
                <hr />
                <p className="mb-0">
                    Pro tip! Add authors to your blog & comment on posts to start collaborating.
                </p>
            </Alert>
        </Container>

    );
}

export default Dashboard;
