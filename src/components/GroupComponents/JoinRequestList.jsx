import React, { useEffect, useState } from "react";
import {
  viewPendingRequests,
  updateJoinRequestStatus,
} from "../../Services/GroupServices"; // Ensure the import path is correct
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation";

const JoinRequestList = ({ groupId }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await viewPendingRequests(groupId);
        setRequests(response.requests); // Adjusting to use the correct data structure
        setFilteredRequests(response.requests); // Initialize filtered requests
      } catch (error) {
        setError("Failed to fetch join requests");
        console.error("Error fetching join requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [groupId]);

  // Filter the requests based on the group name only
  useEffect(() => {
    if (searchQuery) {
      const filtered = requests.filter((request) => {
        // Filter by group name only (assuming `group.name` is a property)
        return request.group_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  }, [searchQuery, requests]); // Re-run when searchQuery or requests change

  const handleGroupRequest = async (requestId) => {
    try {
      await updateJoinRequestStatus(groupId, requestId, requestStatus);
      const response = await viewPendingRequests(groupId);
      setRequests(response.requests);
      setMessage("Request status updated successfully");
      navigate(`/groups/${groupId}`); // Redirect to groups page after updating request status
    } catch (error) {
      setError("Failed to update request status");
      console.error("Error details:", error.response.data);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {filteredRequests.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Request Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.email}</td>
                  <td>
                    {request.firstname || "N/A"} {request.lastname || "N/A"}
                  </td>
                  <td>{new Date(request.request_date).toLocaleString()}</td>
                  <td>
                    <select
                      className="form-select mb-2"
                      value={requestStatus}
                      onChange={(e) => setRequestStatus(e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                    <button
                      className="btn btn-primary mt-2 me-2"
                      onClick={() => handleGroupRequest(request.id)}
                      disabled={!requestStatus}
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No pending join requests.</p>
      )}

      {/* New Section Above Table for More Information or Actions */}
      <div className="mb-4">
        <p>
          Here you can manage the pending join requests for your group. You can
          accept or reject requests as needed. Please review the request details
          and make an informed decision.
        </p>
        <p>
          <strong>Tip:</strong> Accept requests from users who align with the
          group’s mission and values.
        </p>
      </div>
    </div>
  );
};

export default JoinRequestList;
