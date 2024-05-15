import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import  Modal  from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

const Pending = () => {
  const [pendingData, setPendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalAction, setModalAction] = useState('');
  const [modalActionId, setModalActionId] = useState(null);
  const [successModalShow, setSuccessModalShow] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('https://script.google.com/macros/s/AKfycby-wPsbelJ6wjm6mJwsjL7hltt6C_pCOPW5yobt02tEIE3ZdFPxNQcPsJKNrMZICeOF/exec?action=getPendingData')
      .then(response => response.json())
      .then(data => {
        if (data.pendingData) {
          setPendingData(data.pendingData);
        } else {
          setPendingData([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const deleteReferredPerson = (referredPersonID) => {
    setModalAction('delete');
    setModalActionId(referredPersonID);
    setModalMessage('Are you sure you want to delete this referred person?');
    setModalTitle('Confirm Delete');
    setModalShow(true);
  };

  const approveReferredPerson = (referredPersonID) => {
    setModalAction('approve');
    setModalActionId(referredPersonID);
    setModalMessage('Are you sure you want to approve this referred person?');
    setModalTitle('Confirm Approve');
    setModalShow(true);
  };

  const handleModalConfirm = () => {
    if (modalAction === 'delete') {
      deleteAction(modalActionId);
    } else if (modalAction === 'approve') {
      approveAction(modalActionId);
    }
    setModalShow(false);
  };

  const deleteAction = (referredPersonID) => {
    fetch('https://script.google.com/macros/s/AKfycby-wPsbelJ6wjm6mJwsjL7hltt6C_pCOPW5yobt02tEIE3ZdFPxNQcPsJKNrMZICeOF/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ action: 'deletePendingData', referredPersonID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes('successfully')) {
          fetchData();
          setModalMessage('Referred person deleted successfully.');
          setModalTitle('Deleted Successfully');
          setSuccessModalShow(true);
        } else {
          setModalMessage('Referred person not found.');
          setModalTitle('Error');
          setModalShow(true);
        }
      })
      .catch((error) => {
        console.error('Error deleting referred person:', error);
        setModalMessage('Error deleting referred person. Please check the console for details.');
        setModalTitle('Error');
        setModalShow(true);
      });
  };

  const approveAction = (referredPersonID) => {
    fetch('https://script.google.com/macros/s/AKfycby-wPsbelJ6wjm6mJwsjL7hltt6C_pCOPW5yobt02tEIE3ZdFPxNQcPsJKNrMZICeOF/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ action: 'approveReferredPerson', referredPersonID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message.includes('successfully')) {
          fetchData();
          setModalMessage('Referred person approved successfully.');
          setModalTitle('Approved Successfully');
          setSuccessModalShow(true);
        } else {
          setModalMessage('Referred person not found.');
          setModalTitle('Error');
          setModalShow(true);
        }
      })
      .catch((error) => {
        console.error('Error approving referred person:', error);
        setModalMessage('Error approving referred person. Please check the console for details.');
        setModalTitle('Error');
        setModalShow(true);
      });
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="/">Referral System Anteh</Navbar.Brand>
<Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav">
  <Nav className="me-auto">
    <Nav.Link href="/pending">Pending</Nav.Link>
  </Nav>
</Navbar.Collapse>

        </Container>
      </Navbar>
      <div className="container-fluid mt-4">
        <h2 className="mb-4">Pending Data</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="danger" /> 
          </div>
        ) : (
          <>
            {pendingData.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Referrer ID</th>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Contact</th>
                      <th scope="col">Relationship</th>
                      <th scope="col">Course</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingData.map((row) => (
                      <tr key={row.referredPersonID}>
                        <td>{row.referrerID}</td>
                        <td>{row.referredFirstName}</td>
                        <td>{row.referredLastName}</td>
                        <td>{row.email}</td>
                        <td>{row.contact}</td>
                        <td>{row.relationship}</td>
                        <td>{row.course}</td>
                        <td>{row.status}</td>
                        <td>
                          <button type="button" className="btn btn-danger mr-2" onClick={() => deleteReferredPerson(row.referredPersonID)}>Delete</button>
                          <button type="button" className="btn btn-success" onClick={() => approveReferredPerson(row.referredPersonID)}>Approve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No pending data found.</div>
            )}
          </>
        )}
      </div>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
          {modalTitle === 'Error' ? null : <Button variant="primary" onClick={handleModalConfirm}>OK</Button>}
        </Modal.Footer>
      </Modal>
      <Modal show={successModalShow} onHide={() => setSuccessModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setSuccessModalShow(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Pending;
