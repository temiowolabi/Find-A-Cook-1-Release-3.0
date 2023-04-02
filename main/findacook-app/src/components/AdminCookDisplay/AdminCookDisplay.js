import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCookDisplay.css";
import { Link } from "react-router-dom";

const AdminCookDisplay = () => {
  const [cooks, setCooks] = useState([]);

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

  return (
    <>
      <div className="container">
        <main>
          <table className="adminCookDisplay">
            <thead>
              <tr>
                <th>Name</th>
                <th>Application Status</th>
                <th>Verified</th>
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
                  <td>{cook.verified ? "Yes" : "No"}</td>
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
                        <button
                          onClick={() =>
                            updateApplicationStatus(cook._id, "declined")
                          }
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
};

export default AdminCookDisplay;
