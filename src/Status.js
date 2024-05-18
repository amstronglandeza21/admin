// Status.js

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import { LinkContainer } from 'react-router-bootstrap';

const Status = () => {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('https://script.google.com/macros/s/AKfycby-wPsbelJ6wjm6mJwsjL7hltt6C_pCOPW5yobt02tEIE3ZdFPxNQcPsJKNrMZICeOF/exec?action=getStatusData')
      .then(response => response.json())
      .then(data => {
        if (data.statusData) {
          setStatusData(data.statusData);
        } else {
          setStatusData([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching status data:', error);
        setLoading(false);
      });
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/admin">Referral System Anteh</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
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
      <div className="container-fluid mt-4">
        <h2 className="mb-4">Status Data</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : (
          <>
            {statusData.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Referred Person ID</th>
                      <th scope="col">Referrer ID</th>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.referredPersonID}</td>
                        <td>{row.referrerID}</td>
                        <td>{row.referredFirstName}</td>
                        <td>{row.referredLastName}</td>
                        <td>{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No status data found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Status;
