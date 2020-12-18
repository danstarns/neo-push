import React from "react";
import { Navbar, Nav, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NavBar() {
  return (
    <Navbar bg="light" expand="lg" collapseOnSelect>
      <Navbar.Brand>
        <Link to="/" className="title-link">
          Home
          </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="d-flex flex-row">
          <Link to="/sign-in">
            <Card className="p-1 m-1">
              <Nav.Item as="span">
                <span className="navbar-login-icon">
                  <FontAwesomeIcon icon="sign-in-alt" size="1x" />
                </span>
              </Nav.Item>
            </Card>
          </Link>
          <Link to="/sign-up">
            <Card className="p-1 m-1">
              <Nav.Item as="span">
                <span className="navbar-signup-icon">
                  <FontAwesomeIcon icon="user-plus" size="1x" />
                </span>
              </Nav.Item>
            </Card>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
