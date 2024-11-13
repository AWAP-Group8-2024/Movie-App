import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JoinRequestList = ({ groupId }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await 
      setRequests(response.data.requests);
    };
    fetchRequests();
  }, [groupId]);

  return (
    <div>
      <h3>Join Requests</h3>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            Status: {request.status} (Requested on: {request.request_date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JoinRequestList;
