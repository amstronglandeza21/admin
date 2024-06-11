import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

import CustomNavbar from './CustomNavbar'; 

const App = () => {
  const [referrerData, setReferrerData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('Loading...');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [contact, setContact] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [deleteReferrerId, setDeleteReferrerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Function to fetch referrer data from the backend
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}?action=getAllReferrerNames`);
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
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to set the referrer ID for deletion and show the confirmation modal
  const deleteReferrerBy = (referrerID) => {
    setDeleteReferrerId(referrerID);
    setShowConfirmationModal(true);
  };

  // Function to handle the deletion confirmation
  const handleDeleteConfirmed = async () => {
    try {
      setShowConfirmationModal(false);
      setIsSubmitting(true);
  
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteReferrerById', id: deleteReferrerId }),
      });
  
      const data = await response.json();
  
      if (data.message.includes('successfully')) {
        fetchData();
        alert('Referrer deleted successfully.');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting referrer:', error);
      alert('Error deleting referrer. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addReferrerName = async () => {
    if (!firstname || !lastname || !contact) {
      alert('Please enter first name, last name, and contact number.');
      return;
    }
  
    try {
      setIsSubmitting(true);
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ action: 'addReferrerName', firstname, lastname, contact }),
      });
      const data = await response.json();
      if (data.message.includes('successfully')) {
        fetchData();
        setFirstname('');
        setLastname('');
        setContact('');
        alert(`Referrer name added successfully. Referrer ID: ${data.referrerID}`);
      } else if (data.message.toLowerCase().includes('exists')) {
        alert('Referrer name already exists. Please choose a different name.');
      } else {
        alert(`An unknown error occurred. Details: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Error adding referrer name:', error);
      alert('Error adding referrer name. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div>
      <CustomNavbar />
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
              <Form.Group className="mb-3" controlId="contact">
                <Form.Label>Contact Number:</Form.Label>
                <Form.Control type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
              </Form.Group>
              <Button variant="danger" onClick={addReferrerName} disabled={isSubmitting}>
                {isSubmitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Add'}
              </Button>
            </Form>
          </div>
          <div className="col-md-8">
            <h2>Referrer Names</h2>
            <p>Status: {statusMessage}</p>
            {isLoading ? (
              <Spinner animation="border" variant="danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
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
                  {referrerData.map(({ referrerID, firstName, lastName, contact }) => (
                    <tr key={referrerID}>
                      <td>{referrerID}</td>
                      <td>{firstName}</td>
                      <td>{lastName}</td>
                      <td>
                        <Button variant="danger" onClick={() => deleteReferrerBy(referrerID)} disabled={isSubmitting}>
                          {isSubmitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Delete'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </Container>
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this referrer?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed} disabled={isSubmitting}>
            {isSubmitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
