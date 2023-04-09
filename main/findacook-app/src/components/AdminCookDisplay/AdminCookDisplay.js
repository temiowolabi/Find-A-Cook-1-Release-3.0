import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import "./AdminCookDisplay.css";
import { Link } from "react-router-dom";
// import sgMail from '@sendgrid/mail';

const AdminCookDisplay = () => {
  const [cooks, setCooks] = useState([]);
  const [showDeclineMessageModal, setShowDeclineMessageModal] = useState(false);
  const [declineMessage, setDeclineMessage] = useState("");
  const [selectedCook, setSelectedCook] = useState(null);
  const showDeclineMessage = (cook) => {
	setSelectedCook(cook);
	setShowDeclineMessageModal(true);
  };
  const closeDeclineMessage = () => {
    setSelectedCook("");
    setShowDeclineMessageModal(false);
    setDeclineMessage("");
  };

  useEffect(() => {
    fetchCooks();
  }, []);

  const fetchCooks = async () => {
    try {
      const response = await axios.get("http://localhost:5001/cook/allcooks");
      setCooks(response.data.cooks);
    } catch (error) {
      console.error("Error fetching cooks:", error);
    }
  };

  const updateApplicationStatus = async (cookId, status) => {
    try {
      await axios.put(`http://localhost:5001/cook/${cookId}/applicationstatus`, {
        application_status: status,
      });
      fetchCooks();
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  
  const declineCook = async () => {
	if (!selectedCook) {
	  console.error("No cook selected");
	  return;
	}
	try {
	  await axios.put(
		`http://localhost:5001/cook/${selectedCook._id}/applicationstatus`,
		{
		  application_status: "declined",
		  reason_for_decline: declineMessage,
		}
	  );
	  closeDeclineMessage();
	  fetchCooks();
	} catch (error) {
	  console.error("Error declining cook:", error);
	}
  };
  
  
  
  return (
    <>
      <div className="container">
        <main>
          <table className="adminCookDisplay">
            <thead>
              <tr>
                <th>Name</th>
                <th>Application Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cooks.map((cook, index) => (
                <tr key={index}>
                  <td>
                    {cook.cook_first_name} {cook.cook_last_name}
                  </td>
                  <td>{cook.application_status}</td>
                  <td>
                    {cook.application_status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateApplicationStatus(cook._id, "approved")
                          }
                        >
                          Approve
                        </button>
						<button onClick={() => showDeclineMessage(cook)}>Decline</button>
                        {/* <button
                          onClick={() =>
                            updateApplicationStatus(cook._id, "declined")
                          }
                        >
                          Decline
                        </button> */}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


		  <Modal id='' show={showDeclineMessageModal} onHide={closeDeclineMessage}>
  <Modal.Header closeButton>
    <Modal.Title>Decline {selectedCook && selectedCook.cook_first_name}'s Application</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group controlId="declineMessage">
      <Form.Label>Reason for declining</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        value={declineMessage}
        onChange={(e) => setDeclineMessage(e.target.value)}
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <div className="">
      <Button variant="secondary" onClick={closeDeclineMessage}>
        Close
      </Button>
	  <Button variant="danger" onClick={() => declineCook(selectedCook._id)}>
  Decline
</Button>

    </div>
  </Modal.Footer>
</Modal>

        </main>


      </div>
    </>
  );
};

export default AdminCookDisplay;
