import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const App = () => {
  const [referrerData, setReferrerData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycby-wPsbelJ6wjm6mJwsjL7hltt6C_pCOPW5yobt02tEIE3ZdFPxNQcPsJKNrMZICeOF/exec?action=getAllReferrerNames');
      const data = await response.json();

      if (data.referrerNames) {
        setReferrerData(data.referrerNames);
        setStatusMessage('Records found.');
      } else {
        setReferrerData([]);
        setStatusMessage('No records found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setStatusMessage('Error fetching data.');
    }
  };

  const deleteReferrerById = (referrerID) => {
    fetch('https://script.google.com/macros/s/AKfycby-wPsbelJ6wjm6mJwsjL7hltt6C_pCOPW5yobt02tEIE3ZdFPxNQcPsJKNrMZICeOF/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ action: 'deleteReferrer', id: referrerID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes('successfully')) {
          fetchData();
          alert('Referrer deleted successfully.'); // You can replace this with your modal
        } else {
          alert('Referrer not found.');
        }
      })
      .catch((error) => {
        console.error('Error deleting referrer:', error);
        alert('Error deleting referrer. Please check the console for details.');
      });
  };

  const addReferrerName = () => {
    if (!firstname || !lastname) {
      alert('Please enter both first name and last name.');
      return;
    }
  
    fetch('https://script.google.com/macros/s/AKfycby-wPsbelJ6wjm6mJwsjL7hltt6C_pCOPW5yobt02tEIE3ZdFPxNQcPsJKNrMZICeOF/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ action: 'addReferrerName', firstname, lastname }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes('successfully')) {
          fetchData();
          setFirstname(''); // Clear the first name input field
          setLastname('');
          alert(`Referrer name added successfully. Referrer ID: ${data.referrerID}`);
        } else if (data.message.toLowerCase().includes('exists')) {
          alert('Referrer name already exists. Please choose a different name.');
        } else {
          alert(`An unknown error occurred. Details: ${JSON.stringify(data)}`);
        }
      })
      .catch((error) => {
        console.error('Error adding referrer name:', error);
        alert('Error adding referrer name. Please check the console for details.');
      });
  };
  

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="http://localhost:3000/">Referral System Anteh</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="http://localhost:3000/Pending">Pending</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <div className="row">
          <div className="col-md-4">
            <h2>Add Referrer Names</h2>
            <Form>
              <Form.Group className="mb-3" controlId="firstname">
                <Form.Label>First Name:</Form.Label>
                <Form.Control type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lastname">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
              </Form.Group>
              <Button variant="primary" onClick={addReferrerName}>Add Referrer Name</Button>
            </Form>
          </div>
          <div className="col-md-8">
            <h2>Referrer Names</h2>
            <p>Status: {statusMessage}</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Referrer ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {referrerData.map(({ referrerID, firstName, lastName }) => (
                  <tr key={referrerID}>
                    <td>{referrerID}</td>
                    <td>{firstName}</td>
                    <td>{lastName}</td>
                    <td>
                      <Button variant="danger" onClick={() => deleteReferrerById(referrerID)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default App;
