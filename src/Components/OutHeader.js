import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from "./Images/APlogo.png"

export default function OutHeader() {
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-lavender">
            <Container>
                <Navbar.Brand href="#" style={{ marginRight: '100px' }}>
                    <img src={logo} height="50px" width="50px" alt="Jnanabhumi" />
                    <span style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                        &nbsp; Andhra Pradesh Online Legal Case Management System
                    </span>

                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#aboutus">About Us</Nav.Link>
                        <Nav.Link href="#causelist">CauseList</Nav.Link>
                        <NavDropdown title="Contact Us" id="collapsible-nav-dropdown">
                            {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item> */}
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#privacy">Privacy Policy</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>


    )
}
