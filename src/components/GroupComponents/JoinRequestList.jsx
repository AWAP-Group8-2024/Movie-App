import React, { useEffect, useState } from 'react';
import { viewPendingRequests, updateJoinRequestStatus } from '../../services/GroupServices'; // Ensure the import path is correct

const JoinRequestList = ({ groupId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await viewPendingRequests(groupId);
        setRequests(response.requests); // Adjusting to use the correct data structure
      } catch (error) {
        setError('Failed to fetch join requests');
        console.error('Error fetching join requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [groupId]);

  const handleGroupRequest = async (requestId) => {
    try {
      await updateJoinRequestStatus(groupId, requestId, requestStatus);
      const response = await viewPendingRequests(groupId);
      setRequests(response.requests);
      setMessage(`Request ${requestStatus} successfully`);
    } catch (error) {
      setError('Failed to update request status');
      console.error('Error details:', error.response.data);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Join Requests</h3>
      {requests.length > 0 ? (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <p>Email: {request.email}</p>
              <p>
                Name: {request.firstname || 'N/A'} {request.lastname || 'N/A'}
              </p>
              <p>Request Date: {new Date(request.request_date).toLocaleString()}</p>
              <select
                value={requestStatus}
                onChange={(e) => setRequestStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="accepted">Accept</option>
                <option value="rejected">Reject</option>
              </select>
              <button onClick={() => handleGroupRequest(request.id)}>Submit</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending join requests.</p>
      )}
    </div>
  );
};

export default JoinRequestList;
