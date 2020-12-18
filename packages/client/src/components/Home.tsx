import React, { useContext, useState } from 'react';
import { Jumbotron } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { auth } from "../contexts";
import constants from "../constants";

function Home() {
    const { isLoggedIn } = useContext(auth.Context);
    const history = useHistory();

    if (isLoggedIn) {
        history.push(constants.DASHBOARD_PAGE);
    }

    return (
        <Jumbotron>
            <p>Hello World</p>
        </Jumbotron>
    );
};


export default Home;