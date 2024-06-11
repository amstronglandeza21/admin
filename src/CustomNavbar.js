
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import logo from './logo.png'; 
import './CustomNavbar.css';

const CustomNavbar = () => {
  return (
    <Navbar className="navbar-custom" variant="light">
      <Container>
        <Navbar.Brand href="/admin">
          <img
            src={logo}
            width="220"
            height="100"
            className="d-inline-block align-top"
            alt="Logo"
          />

        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/pending">
              <Nav.Link>Pending</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/status">
              <Nav.Link>Status</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
