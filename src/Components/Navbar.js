import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

export default function DashboardHeader() {
  let userName = localStorage.getItem("username");
  let image = localStorage.getItem("photos");

  const logout = () => {
    window.localStorage.clear();
    dispatch({ type: "LOGIN_DETAILS", payload: {} });
    window.location.href = "http://localhost:3000/login";
  };

  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="navbar navbar-expand-lg navbar-light bg-info"
      >
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link href="#deets">
                <img>{image}</img>
              </Nav.Link>
              <Nav.Link className="text-uppercase">
                <b>Welcome:{userName}</b>
              </Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                <Button className="bg-info" onClick={logout}>
                  Logout
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
