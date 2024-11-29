import { useEffect, useState } from "react";
import { viewPendingRequests, updateJoinRequestStatus } from "../../services/GroupServices";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import JoinRequestElement from "../../HomeComponents/JoinRequestElement";

const JoinRequestList = ({ groupId }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await viewPendingRequests(groupId);
        setRequests(response); // Adjusting to use the correct data structure
        setFilteredRequests(response); // Initialize filtered requests
      } catch (error) {
        setError("Failed to fetch join requests");
        console.error("Error fetching join requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [groupId]);

  // Filter the requests based on the search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = requests.filter((request) => {
        // Assuming you may want to filter by requester's name or email as well
        return (
          request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  }, [searchQuery, requests]);

  const handleGroupRequest = async (requestId, requestStatus) => {
    try {
      await updateJoinRequestStatus(groupId, requestId, requestStatus);
      const response = await viewPendingRequests(groupId);
      setRequests(response);
      setMessage("Request status updated successfully");
      navigate(`/groups/${groupId}`); // Redirect to groups page after updating request status
    } catch (error) {
      setError("Failed to update request status");
      console.error("Error details:", error.response?.data);
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

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by email or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
                <JoinRequestElement 
                  key={request.id}
                  request={request}
                  handleGroupRequest={handleGroupRequest}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No pending join requests.</p>
      )}

      {/* Information Section Above Table for More Context */}
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
